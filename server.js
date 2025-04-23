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

// Автоматическое создание папки data и файла users.json
(async () => {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR);
    await fs.writeFile(USERS_FILE, "[]");
    console.log("✅ Папка data и файл users.json созданы");
  }
})();

// Регистрация
// server.js (обработчик регистрации)
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
        isAdmin: 0 // По умолчанию все пользователи не админы
      };
  
      users.push(newUser);
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2)); // Запись в JSON
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
  
      console.log("Успешный вход:", { 
        email: user.email, 
        isAdmin: user.isAdmin 
      });
  
      res.json({ 
        token: uuidv4(), 
        userId: user.id, 
        isAdmin: user.isAdmin 
      });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

// Запуск сервера
app.listen(5000, () => {
  console.log("Сервер запущен на http://localhost:5000");
  console.log("Путь к users.json:", USERS_FILE);
});

// Добавьте новый маршрут для корзины
app.get('/api/cart', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf-8'));
    const user = users.find(u => u.token === token);
    
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const cartFile = path.join(DATA_DIR, `cart_${user.id}.json`);
    try {
      const cartData = await fs.readFile(cartFile, 'utf-8');
      res.json({ items: JSON.parse(cartData) });
    } catch {
      res.json({ items: [] });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf-8'));
    const user = users.find(u => u.token === token);
    
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const cartFile = path.join(DATA_DIR, `cart_${user.id}.json`);
    await fs.writeFile(cartFile, JSON.stringify(req.body.items || []));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/update-products', async (req, res) => {
  try {
    const productsData = await fs.readFile('data/products.json', 'utf-8');
    const products = JSON.parse(productsData);
    
    req.body.items.forEach(cartItem => {
      const product = products.products.find(p => p.id === cartItem.productId);
      if (product) {
        product.quantity -= cartItem.quantity;
      }
    });

    await fs.writeFile('data/products.json', JSON.stringify(products, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления продуктов' });
  }
});

// Модифицируем обработчик корзины
app.post('/api/cart', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf-8'));
    const user = users.find(u => u.token === token);
    
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const cartFile = path.join(DATA_DIR, `cart_${user.id}.json`);
    await fs.writeFile(cartFile, JSON.stringify(req.body.items || []));
    
    // Обновляем количество товаров
    const productsData = await fs.readFile('data/products.json', 'utf-8');
    const products = JSON.parse(productsData);
    
    req.body.items.forEach(cartItem => {
      const product = products.products.find(p => p.id === cartItem.productId);
      if (product) {
        product.quantity -= cartItem.quantity;
      }
    });

    await fs.writeFile('data/products.json', JSON.stringify(products, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});