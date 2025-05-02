const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const schedule = require("node-schedule");
const { isSameWeek, format } = require('date-fns');
// const { parseISO, startOfWeek, format: dateFnsFormat } = require('date-fns');


const app = express();
const ORDER_STATUSES = {
  DELIVERED: 'Доставлено',
  INSTALLED: 'Установлено'
};

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const DELIVERIES_FILE = path.join(DATA_DIR, "deliveries.json");
const { startOfWeek, format: dateFnsFormat } = require('date-fns');

const FILES = {
  users: path.join(DATA_DIR, "users.json"),
  products: path.join(DATA_DIR, "products.json"),
  orders: path.join(DATA_DIR, "orders.json"),
  deliveries: path.join(DATA_DIR, "deliveries.json")
};

// Инициализация файлов при запуске
(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log("✅ Папка data создана");
    
    const defaultContent = {
      [FILES.users]: "[]",
      [FILES.products]: JSON.stringify({ categories: [], products: [] }),
      [FILES.orders]: "[]",
      [FILES.deliveries]: "[]"
    };

    for (const [file, content] of Object.entries(defaultContent)) {
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, content);
        console.log(`✅ Файл ${path.basename(file)} создан`);
      }
    }
  } catch (err) {
    console.error("Ошибка инициализации:", err);
    process.exit(1);
  }
})();

// Регистрация пользователя
// server.js (исправленный обработчик регистрации)
app.post("/api/register", async (req, res) => {
  console.log("Полученные данные:", req.body);
  try {
    const users = JSON.parse(await fs.readFile(FILES.users, "utf-8"));
    const { email, phone, password } = req.body;

    // Валидация телефона
    if (!/^\+7\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Неверный формат телефона" });
    }

    // Проверка уникальности
    if (users.some(u => u.email === email)) {
      return res.status(400).json({ message: "Email уже зарегистрирован" });
    }
    if (users.some(u => u.phone === phone)) {
      return res.status(400).json({ message: "Номер телефона уже используется" });
    }

    // Создание пользователя
    const newUser = {
      id: uuidv4(),
      email,
      phone,
      password: await bcrypt.hash(password, 10),
      createdAt: new Date().toISOString(),
      isAdmin: 0,
      token: null
    };

    users.push(newUser);
    await fs.writeFile(FILES.users, JSON.stringify(users, null, 2));
    res.status(201).json({ message: "Регистрация успешна" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Авторизация (исправленный обработчик)
app.post("/api/login", async (req, res) => {
  try {
    const users = JSON.parse(await fs.readFile(FILES.users, "utf-8"));
    const { login, password } = req.body; // Изменено с email на login

    // Ищем по email или телефону
    const user = users.find(u => 
      u.email === login || u.phone === login
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Неверные учетные данные" });
    }

    const token = uuidv4();
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, token } : u
    );
    
    await fs.writeFile(FILES.users, JSON.stringify(updatedUsers, null, 2));
    res.json({ 
      token,
      userId: user.id,
      isAdmin: user.isAdmin 
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Работа с корзиной
app.route("/api/cart")
  .get(async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const users = JSON.parse(await fs.readFile(FILES.users, 'utf-8'));
      const user = users.find(u => u.token === token);

      if (!user) return res.status(401).json({ message: "Не авторизован" });

      const cartPath = path.join(DATA_DIR, `cart_${user.id}.json`);
      try {
        const cart = await fs.readFile(cartPath, 'utf-8');
        res.json(JSON.parse(cart));
      } catch {
        res.json({ items: [] });
      }
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  })
  .post(async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const users = JSON.parse(await fs.readFile(FILES.users, 'utf-8'));
      const user = users.find(u => u.token === token);

      if (!user) return res.status(401).json({ message: "Не авторизован" });

      const cartPath = path.join(DATA_DIR, `cart_${user.id}.json`);
      await fs.writeFile(cartPath, JSON.stringify(req.body));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

// Валидация корзины
app.post("/api/validate-cart", async (req, res) => {
  try {
    const productsData = JSON.parse(await fs.readFile(FILES.products, 'utf-8'));
    const cartItems = req.body.items;

    for (const item of cartItems) {
      const product = productsData.products.find(p => p.id === item.productId);
      if (!product || item.quantity > product.quantity) {
        return res.status(400).json({ 
          message: `Товар "${product?.name}" недоступен в нужном количестве` 
        });
      }
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Работа с заказами
app.get('/api/orders', async (req, res) => {
  try {
    let orders = JSON.parse(await fs.readFile(ORDERS_FILE, 'utf-8'));
    orders = orders.map(order => {
      try {
        const updatedOrder = checkOrderStatus(order);
        if (updatedOrder.status !== order.status) {
          console.log(`Обновлен статус заказа ${order.id}: ${order.status} -> ${updatedOrder.status}`);
        }
        return updatedOrder;
      } catch (err) {
        console.error('Ошибка обновления статуса заказа:', order.id, err);
        return order;
      }
    });
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
    const userOrders = orders.filter(o => o.userId === req.query.userId);
    res.json(userOrders);
  } catch (error) {
    console.error('Ошибка в обработчике GET /api/orders:', error);
    res.status(500).json({ message: "Ошибка сервера: " + error.message });
  }
});

// Проверка статуса заказа
const checkOrderStatus = (order) => {
  const now = new Date();
  
  // Обработка самовывоза
  if (order.date === "Самовывоз") {
    if (order.status !== ORDER_STATUSES.INSTALLED) {
      order.status = "Готов к выдаче";
    }
    return order;
  }

  // Основная логика для доставки
  const deliveryDate = new Date(order.date);
  if (isNaN(deliveryDate.getTime())) {
    console.warn(`Неверный формат даты доставки для заказа ${order.id}`);
    return order;
  }

  // Обновление статуса доставки
  if (now > deliveryDate && order.status !== ORDER_STATUSES.INSTALLED) {
    order.status = ORDER_STATUSES.DELIVERED;
  }

  // Обработка установки
  if (order.installationRequired && order.installationDate) {
    const installationDate = new Date(order.installationDate);
    if (!isNaN(installationDate.getTime()) && now > installationDate) {
      order.status = ORDER_STATUSES.INSTALLED;
    }
  }

  return order;
};


// Расписание проверки статусов
schedule.scheduleJob('*/5 * * * *', async () => {
  console.log(`[${new Date().toISOString()}] Запуск проверки статусов...`);
  try {
    let orders = JSON.parse(await fs.readFile(FILES.orders, 'utf-8'));
    const updatedOrders = orders.map(checkOrderStatus);
    
    const changedOrders = updatedOrders.filter((o, i) => o.status !== orders[i].status);
    if (changedOrders.length > 0) {
      await fs.writeFile(FILES.orders, JSON.stringify(updatedOrders, null, 2));
      console.log(`Обновлено ${changedOrders.length} заказов:`);
      changedOrders.forEach(o => console.log(`- Заказ ${o.id}: ${o.status}`));
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }
});

app.get('/api/orders/:orderId', async (req, res) => {
  try {
    // 1. Читаем все заказы
    let orders = JSON.parse(await fs.readFile(ORDERS_FILE, 'utf-8'));
    
    // 2. Находим нужный заказ
    const orderIndex = orders.findIndex(o => o.id === req.params.orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    // 3. Проверяем и обновляем статус
    const updatedOrder = checkOrderStatus(orders[orderIndex]);
    
    // 4. Если статус изменился - сохраняем
    if (updatedOrder.status !== orders[orderIndex].status) {
      orders[orderIndex] = updatedOrder;
      await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
      console.log(`[GET /orders/${req.params.orderId}] Статус обновлен: ${updatedOrder.status}`);
    }

    // 5. Возвращаем актуальный заказ
    res.json(updatedOrder);
    
  } catch (error) {
    console.error(`[GET /orders/${req.params.orderId}] Ошибка:`, error);
    res.status(500).json({ 
      message: "Ошибка сервера", 
      details: error.message 
    });
  }
});

// Получение дат доставки
app.get("/api/deliveries", async (req, res) => {
  try {
    const data = await fs.readFile(FILES.deliveries, "utf-8");
    const deliveries = JSON.parse(data);
    
    if (!Array.isArray(deliveries)) {
      console.error("Файл deliveries.json содержит невалидные данные");
      return res.status(500).json({ message: "Ошибка данных" });
    }
    
    res.json({ deliveries });
  } catch (err) {
    console.error("Ошибка чтения deliveries.json:", err);
    res.status(500).json({ message: "Не удалось загрузить даты доставки" });
  }
});

// Оформление заказа
app.post("/api/checkout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const users = JSON.parse(await fs.readFile(FILES.users, "utf-8"));
    const user = users.find(u => u.token === token);

    if (!user) {
      return res.status(401).json({ message: "Требуется авторизация" });
    }

    const orderData = {
      ...req.body,
      id: uuidv4(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      status: "В обработке",
    };

    // Обновление deliveries.json
    if (orderData.date && orderData.date !== "Самовывоз") {
      let deliveries;
      try {
        const data = await fs.readFile(FILES.deliveries, "utf-8");
        deliveries = JSON.parse(data);
        
        if (!Array.isArray(deliveries)) {
          console.error("Ошибка структуры deliveries.json. Инициализируем новый массив");
          deliveries = [];
        }
      } catch (err) {
        console.error("Ошибка чтения файла доставок:", err);
        deliveries = [];
      }

      deliveries.push({ date: orderData.date });
      await fs.writeFile(FILES.deliveries, JSON.stringify(deliveries, null, 2));
    }

    // Обновление продуктов
    const productsData = JSON.parse(await fs.readFile(FILES.products, "utf-8"));
    orderData.items.forEach(item => {
      const product = productsData.products.find(p => p.id === item.productId);
      if (product) product.quantity -= item.quantity;
    });

    await fs.writeFile(FILES.products, JSON.stringify(productsData, null, 2));

    // Сохранение заказа
    const orders = JSON.parse(await fs.readFile(FILES.orders, "utf-8"));
    orders.push(orderData);
    await fs.writeFile(FILES.orders, JSON.stringify(orders, null, 2));

    res.status(201).json({ success: true, orderId: orderData.id });
  } catch (err) {
    console.error("Ошибка оформления заказа:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});
app.get("/api/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const users = JSON.parse(await fs.readFile(FILES.users, 'utf-8'));
    const user = users.find(u => u.token === token);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Возвращаем данные без чувствительной информации
    const { password, token: _, ...safeUser } = user;
    res.json(safeUser);

  } catch (error) {
    console.error('Ошибка в /api/user:', error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Обновление данных пользователя
app.put("/api/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const users = JSON.parse(await fs.readFile(FILES.users, 'utf-8'));
    const userIndex = users.findIndex(u => u.token === token);
    
    if (userIndex === -1) return res.status(404).json({ message: "Пользователь не найден" });

    const { email, phone } = req.body;
    
    // Валидация
    if (!/^\+7\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Неверный формат телефона" });
    }

    // Проверка уникальности
    if (users.some((u, index) => index !== userIndex && u.email === email)) {
      return res.status(400).json({ message: "Email уже используется" });
    }

    // Обновление данных
    users[userIndex] = { ...users[userIndex], email, phone };
    await fs.writeFile(FILES.users, JSON.stringify(users, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});
app.post("/api/change-password", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const users = JSON.parse(await fs.readFile(FILES.users, 'utf-8'));
    const userIndex = users.findIndex(u => u.token === token);
    
    if (userIndex === -1) return res.status(404).json({ message: "Пользователь не найден" });

    const { oldPassword, newPassword } = req.body;
    const user = users[userIndex];

    if (!await bcrypt.compare(oldPassword, user.password)) {
      return res.status(401).json({ message: "Неверный текущий пароль" });
    }

    users[userIndex].password = await bcrypt.hash(newPassword, 10);
    await fs.writeFile(FILES.users, JSON.stringify(users, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

const adminOnly = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Требуется авторизация" });

    const users = JSON.parse(await fs.readFile(FILES.users, 'utf-8'));
    const user = users.find(u => u.token === token);
    
    if (!user || !user.isAdmin) {
      // Важно: отправлять 403 даже если токен есть, но нет прав
      return res.status(403).json({ message: "Доступ запрещен" });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

app.get('/api/admin/orders', adminOnly, async (req, res) => {
  try {
    const orders = JSON.parse(await fs.readFile(FILES.orders, 'utf-8'));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

const { subYears, subMonths, subDays } = require('date-fns');

// Добавьте новые эндпоинты для статистики
app.get('/api/admin/stats', adminOnly, async (req, res) => {
  try {
    const period = req.query.period || 'all';
    const orders = JSON.parse(await fs.readFile(FILES.orders, 'utf-8'));
    const products = JSON.parse(await fs.readFile(FILES.products, 'utf-8')).products;
    
    const filteredOrders = filterOrdersByPeriod(orders, period);
    
    res.json({
      totalRevenue: filteredOrders.reduce((sum, o) => sum + parseFloat(o.total), 0),
      totalOrders: filteredOrders.length,
      totalProducts: products.length,
      lowStock: products.filter(p => p.quantity < 5).length,
      recentOrders: filteredOrders.slice(-5) // Возвращаем 5 последних из ОТФИЛЬТРОВАННЫХ
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Экспорт данных в CSV
app.get('/api/admin/export', adminOnly, async (req, res) => {
  try {
    const period = req.query.period || 'all';
    const orders = JSON.parse(await fs.readFile(FILES.orders, 'utf-8'));
    const filtered = filterOrdersByPeriod(orders, period);
    
    const csv = json2csv.parse(filtered, {
      fields: ['id', 'date', 'total', 'status', 'createdAt']
    });
    
    res.header('Content-Type', 'text/csv');
    res.attachment(`orders_${period}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Ошибка экспорта" });
  }
});

// Функция фильтрации заказов
const filterOrdersByPeriod = (orders, period) => {
  const now = new Date();
  switch(period) {
    case 'year':
      return orders.filter(o => new Date(o.createdAt) > subYears(now, 1));
    case 'month':
      return orders.filter(o => new Date(o.createdAt) > subMonths(now, 1));
    case 'week':
      return orders.filter(o => new Date(o.createdAt) > subDays(now, 7));
    default:
      return orders;
  }
}

// В эндпоинте /api/admin/deliveries-stats
app.get('/api/admin/deliveries-stats', adminOnly, async (req, res) => {
  try {
    const { period } = req.query;
    const deliveries = JSON.parse(await fs.readFile(FILES.deliveries, 'utf-8'));
    
    // Фильтрация данных
    const filtered = deliveries.filter(d => {
      const deliveryDate = new Date(d.date);
      const now = new Date();
      
      switch(period) {
        case 'year': return deliveryDate >= subYears(now, 1);
        case 'month': return deliveryDate >= subMonths(now, 1);
        case 'week': return deliveryDate >= subDays(now, 7);
        default: return true;
      }
    });

    // Группировка данных
    const grouped = filtered.reduce((acc, { date }) => {
      const deliveryDate = new Date(date);
      let key;
      
      switch(period) {
        case 'year':
          key = format(deliveryDate, 'yyyy-MM');
          break;
        case 'month':
          key = format(deliveryDate, 'yyyy-MM-dd');
          break;
        case 'week':
          key = format(startOfWeek(deliveryDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
          break;
        default:
          key = format(deliveryDate, 'yyyy-MM-dd');
      }
      
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Форматирование результата
    const result = Object.entries(grouped).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      totalDeliveries: deliveries.length,
      currentPeriod: filtered.length,
      data: result
    });
  } catch (error) {
    console.error('Ошибка в deliveries-stats:', error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Исправленная функция фильтрации
const filterDeliveries = (deliveries, period) => {
  const now = new Date();
  switch(period) {
    case 'year': return deliveries.filter(d => new Date(d.date) > subYears(now, 1));
    case 'month': return deliveries.filter(d => new Date(d.date) > subMonths(now, 1));
    case 'week': return deliveries.filter(d => new Date(d.date) > subDays(now, 7));
    default: return deliveries;
  }
};

// Корректная группировка по неделям
const getDeliveryGroupKey = (dateString, period) => {
  const date = new Date(dateString);
  return period === 'week' 
    ? format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
    : format(date, 'yyyy-MM-dd');
};

// server.js
app.get('/api/admin/verify', adminOnly, (req, res) => {
  res.status(200).json({ valid: true });
});

// Экспорт доставок
app.get('/api/admin/export-deliveries', adminOnly, async (req, res) => {
  try {
    const { period, specificDate } = req.query;
    const stats = await fetchDeliveryStats(period, specificDate); // Логика аналогична эндпоинту выше
    
    const csv = json2csv.parse(stats, {
      fields: ['date', 'count'],
      header: true
    });
    
    res.header('Content-Type', 'text/csv');
    res.attachment(`deliveries_${period}_${specificDate || 'all'}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Ошибка экспорта" });
  }
});


// Эндпоинт статистики пользователей
app.get('/api/admin/users-stats', adminOnly, async (req, res) => {
  try {
    const period = req.query.period || 'all';
    const users = JSON.parse(await fs.readFile(FILES.users, 'utf-8'));
    
    const filteredUsers = users.filter(u => {
      const regDate = new Date(u.createdAt);
      const now = new Date();
      
      switch(period) {
        case 'year': return regDate > subYears(now, 1);
        case 'month': return regDate > subMonths(now, 1);
        case 'week': return regDate > subDays(now, 7);
        default: return true; // all
      }
    });

    res.json({
      totalUsers: users.length,
      newUsers: filteredUsers.length,
      registrationData: filteredUsers
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Эндпоинт экспорта
app.get('/api/admin/export-users', adminOnly, async (req, res) => {
  try {
    const stats = JSON.parse(await fs.readFile(FILES.users, 'utf-8'))
      .map(user => ({
        id: user.id,
        email: user.email,
        phone: user.phone,
        registrationDate: user.createdAt,
        isAdmin: user.isAdmin ? 'Да' : 'Нет'
      }));

    const csv = json2csv.parse(stats);
    res.header('Content-Type', 'text/csv');
    res.attachment('users_export.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Ошибка экспорта" });
  }
});

// server.js
app.get("/api/user/check-admin", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.json({ isAdmin: false });

    const users = JSON.parse(await fs.readFile(FILES.users, 'utf-8'));
    const user = users.find(u => u.token === token);
    
    res.json({ isAdmin: user?.isAdmin === 1 });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get('/api/admin/installations-stats', adminOnly, async (req, res) => {
  try {
    const period = req.query.period || 'all';
    const orders = JSON.parse(await fs.readFile(FILES.orders, 'utf-8'));
    
    const filtered = orders.filter(o => 
      o.status === 'Установлено' && 
      new Date(o.installationDate) > getPeriodStart(period)
    );

    res.json({
      totalInstallations: orders.filter(o => o.status === 'Установлено').length,
      currentPeriod: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Вспомогательная функция для дат
const getPeriodStart = (period) => {
  const now = new Date();
  switch(period) {
    case 'year': return subYears(now, 1);
    case 'month': return subMonths(now, 1);
    case 'week': return subDays(now, 7);
    default: return new Date(0);
  }
};

app.listen(5000, () => {
  console.log("Сервер запущен на http://localhost:5000");
});