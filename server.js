//server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Инициализация файлов
(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log("✅ Папка data создана");
  } catch {}

  const files = {
    [USERS_FILE]: "[]",
    [PRODUCTS_FILE]: JSON.stringify({ categories: [], products: [] }),
    [ORDERS_FILE]: "[]"
  };

  for (const [file, content] of Object.entries(files)) {
    try {
      await fs.access(file);
    } catch {
      await fs.writeFile(file, content);
      console.log(`✅ Файл ${path.basename(file)} создан`);
    }
  }
})();

// Регистрация
app.post("/api/register", async (req, res) => {
  try {
    const users = JSON.parse(await fs.readFile(USERS_FILE, "utf-8"));
    const { email, password } = req.body;

    if (users.some(u => u.email === email)) {
      return res.status(400).json({ message: "Email уже зарегистрирован" });
    }

    const newUser = {
      id: uuidv4(),
      email,
      password: await bcrypt.hash(password, 10),
      createdAt: new Date().toISOString(),
      isAdmin: 0
    };

    users.push(newUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    res.status(201).json({ message: "Регистрация успешна" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Авторизация
app.post("/api/login", async (req, res) => {
  try {
    const users = JSON.parse(await fs.readFile(USERS_FILE, "utf-8"));
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Неверные учетные данные" });
    }

    const token = uuidv4();
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, token } : u
    );

    await fs.writeFile(USERS_FILE, JSON.stringify(updatedUsers, null, 2));

    res.json({ 
      token,
      userId: user.id,
      isAdmin: user.isAdmin 
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение корзины
app.get("/api/cart", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf-8'));
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
});

// Сохранение корзины
app.post("/api/cart", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf-8'));
    const user = users.find(u => u.token === token);

    if (!user) return res.status(401).json({ message: "Не авторизован" });

    const cartPath = path.join(DATA_DIR, `cart_${user.id}.json`);
    await fs.writeFile(cartPath, JSON.stringify(req.body));

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Валидация корзины (исправленный единственный эндпоинт)
app.post("/api/validate-cart", async (req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(PRODUCTS_FILE, 'utf-8'));
    const cartItems = req.body.items;

    for (const item of cartItems) {
      const product = data.products.find(p => p.id === item.productId);
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

// Оформление заказа
app.post("/api/checkout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf-8'));
    const user = users.find(u => u.token === token);

    if (!user) return res.status(401).json({ message: "Требуется авторизация" });

    // Создаем orders.json если отсутствует
    try {
      await fs.access(ORDERS_FILE);
    } catch {
      await fs.writeFile(ORDERS_FILE, "[]");
    }

    const orderData = {
      ...req.body,
      id: uuidv4(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      status: "В обработке"
    };

    const orders = JSON.parse(await fs.readFile(ORDERS_FILE, 'utf-8'));
    orders.push(orderData);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));

    res.status(201).json({ success: true, orderId: orderData.id });
  } catch (error) {
    console.error("Ошибка заказа:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});


// Работа с заказами
app.get('/api/orders', async (req, res) => {
  try {
    let orders;
    try {
      orders = JSON.parse(await fs.readFile(ORDERS_FILE, 'utf-8'));
    } catch {
      orders = [];
    }

    const userOrders = orders.filter(order => 
      order.userId === req.query.userId
    );
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.listen(5000, () => {
  console.log("Сервер запущен на http://localhost:5000");
});