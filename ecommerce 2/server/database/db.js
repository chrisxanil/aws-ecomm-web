import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  defaultUsers,
  defaultCategories,
  defaultProducts,
  defaultReviews,
  defaultOrders
} from './seed-data.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_STORE_FILE = path.join(__dirname, 'local-store.json');

let pool = null;
let activeEngine = 'fallback'; // 'mysql' | 'fallback'

// In-memory / file-backed fallback state
let fallbackData = {
  users: [...defaultUsers],
  categories: [...defaultCategories],
  products: [...defaultProducts],
  reviews: [...defaultReviews],
  orders: [...defaultOrders]
};

// Save fallback data to disk
const persistFallback = () => {
  try {
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(fallbackData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist local store:', err.message);
  }
};

// Load fallback data from disk if present
const loadFallback = () => {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const content = fs.readFileSync(LOCAL_STORE_FILE, 'utf-8');
      fallbackData = JSON.parse(content);
    } else {
      persistFallback();
    }
  } catch (err) {
    console.warn('Could not read local store, defaulting to initial seed data');
  }
};

export async function initDatabase() {
  loadFallback();

  const dbHost = process.env.DB_HOST || '127.0.0.1';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'nexacart_db';
  const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

  // Attempt MySQL connection with a short timeout
  try {
    const testPool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      port: dbPort,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000
    });

    const connection = await testPool.getConnection();
    await connection.ping();
    connection.release();

    pool = testPool;
    activeEngine = 'mysql';
    console.log(`\x1b[32m✔ [Database] Successfully connected to MySQL at ${dbHost}:${dbPort}/${dbName}\x1b[0m`);

    // Ensure tables exist in MySQL
    await ensureMySQLTables();
  } catch (err) {
    activeEngine = 'fallback';
    console.log(`\x1b[33mℹ [Database] MySQL not reachable at ${dbHost}:${dbPort} (${err.code || err.message}).\x1b[0m`);
    console.log(`\x1b[36m⚡ [Database] Running in embedded persistence mode (MySQL-ready schema & models active). All features fully functional.\x1b[0m`);
  }
}

async function ensureMySQLTables() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.toLowerCase().startsWith('create database') && !s.toLowerCase().startsWith('use '));

      for (const statement of statements) {
        try {
          await pool.query(statement);
        } catch (e) {
          // ignore already existing or warnings
        }
      }

      // Check if seeded
      const [rows] = await pool.query('SELECT COUNT(*) as count FROM products');
      if (rows[0].count === 0) {
        console.log('🌱 Seeding initial MySQL data...');
        // Insert categories
        for (const cat of defaultCategories) {
          await pool.query(
            'INSERT IGNORE INTO categories (id, name, slug, description, icon) VALUES (?, ?, ?, ?, ?)',
            [cat.id, cat.name, cat.slug, cat.description, cat.icon]
          );
        }
        // Insert users
        for (const u of defaultUsers) {
          await pool.query(
            'INSERT IGNORE INTO users (id, name, email, password, role, avatar, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [u.id, u.name, u.email, u.password, u.role, u.avatar, u.phone, u.address]
          );
        }
        // Insert products
        for (const p of defaultProducts) {
          await pool.query(
            'INSERT IGNORE INTO products (id, name, slug, category_id, category_name, price, original_price, stock, rating, reviews_count, badge, is_featured, image_url, description, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [p.id, p.name, p.slug, p.category_id, p.category_name, p.price, p.original_price, p.stock, p.rating, p.reviews_count, p.badge, p.is_featured, p.image_url, p.description, JSON.stringify(p.features)]
          );
        }
        console.log('✔ Initial MySQL data seeded successfully');
      }
    }
  } catch (e) {
    console.warn('MySQL table initialization warning:', e.message);
  }
}

// ---------------- Database Repository API ----------------

export const db = {
  getEngine: () => activeEngine,

  // Products
  async getProducts({ category, search, sort, minPrice, maxPrice, featured } = {}) {
    if (activeEngine === 'mysql') {
      let sql = 'SELECT * FROM products WHERE 1=1';
      const params = [];

      if (category && category !== 'all') {
        const cat = fallbackData.categories.find(c => c.slug === category || c.name.toLowerCase() === category.toLowerCase() || c.id === parseInt(category, 10));
        const catId = cat ? cat.id : (parseInt(category, 10) || 0);
        const catName = cat ? cat.name : category;
        sql += ' AND (category_id = ? OR category_name = ?)';
        params.push(catId, catName);
      }
      if (search) {
        sql += ' AND (name LIKE ? OR description LIKE ? OR category_name LIKE ?)';
        const queryTerm = `%${search}%`;
        params.push(queryTerm, queryTerm, queryTerm);
      }
      if (minPrice !== undefined && minPrice !== '') {
        sql += ' AND price >= ?';
        params.push(parseFloat(minPrice));
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        sql += ' AND price <= ?';
        params.push(parseFloat(maxPrice));
      }
      if (featured === true || featured === 'true') {
        sql += ' AND is_featured = 1';
      }

      if (sort === 'price-low') sql += ' ORDER BY price ASC';
      else if (sort === 'price-high') sql += ' ORDER BY price DESC';
      else if (sort === 'rating') sql += ' ORDER BY rating DESC';
      else if (sort === 'newest') sql += ' ORDER BY created_at DESC';
      else sql += ' ORDER BY id ASC';

      const [rows] = await pool.query(sql, params);
      return rows.map(r => ({
        ...r,
        features: typeof r.features === 'string' ? JSON.parse(r.features) : r.features,
        is_featured: Boolean(r.is_featured)
      }));
    }

    // Fallback mode
    let list = [...fallbackData.products];
    if (category && category !== 'all') {
      const cat = fallbackData.categories.find(c => c.slug === category || c.name.toLowerCase() === category.toLowerCase() || c.id === parseInt(category, 10));
      const targetId = cat ? cat.id : parseInt(category, 10);
      const targetName = cat ? cat.name.toLowerCase() : category.toLowerCase();
      list = list.filter(p => p.category_id === targetId || p.category_name.toLowerCase() === targetName);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category_name.toLowerCase().includes(q));
    }
    if (minPrice !== undefined && minPrice !== '') {
      list = list.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      list = list.filter(p => p.price <= parseFloat(maxPrice));
    }
    if (featured === true || featured === 'true') {
      list = list.filter(p => p.is_featured);
    }

    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'newest') list.sort((a, b) => b.id - a.id);

    return list;
  },

  async getProductById(id) {
    const numId = parseInt(id, 10);
    if (activeEngine === 'mysql') {
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [numId]);
      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        ...r,
        features: typeof r.features === 'string' ? JSON.parse(r.features) : r.features,
        is_featured: Boolean(r.is_featured)
      };
    }
    return fallbackData.products.find(p => p.id === numId) || null;
  },

  async getProductBySlug(slug) {
    if (activeEngine === 'mysql') {
      const [rows] = await pool.query('SELECT * FROM products WHERE slug = ?', [slug]);
      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        ...r,
        features: typeof r.features === 'string' ? JSON.parse(r.features) : r.features,
        is_featured: Boolean(r.is_featured)
      };
    }
    return fallbackData.products.find(p => p.slug === slug) || null;
  },

  async createProduct(data) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const categoryName = data.category_name || (fallbackData.categories.find(c => c.id === parseInt(data.category_id, 10))?.name || 'General AI');

    if (activeEngine === 'mysql') {
      const [result] = await pool.query(
        `INSERT INTO products (name, slug, category_id, category_name, price, original_price, stock, rating, reviews_count, badge, is_featured, image_url, description, features)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.name,
          slug,
          data.category_id || 1,
          categoryName,
          data.price,
          data.original_price || null,
          data.stock || 25,
          data.rating || 5.0,
          0,
          data.badge || null,
          data.is_featured ? 1 : 0,
          data.image_url,
          data.description,
          JSON.stringify(data.features || {})
        ]
      );
      return this.getProductById(result.insertId);
    }

    const newId = fallbackData.products.length ? Math.max(...fallbackData.products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name: data.name,
      slug,
      category_id: parseInt(data.category_id || 1, 10),
      category_name: categoryName,
      price: parseFloat(data.price),
      original_price: data.original_price ? parseFloat(data.original_price) : null,
      stock: parseInt(data.stock || 25, 10),
      rating: parseFloat(data.rating || 5.0),
      reviews_count: 0,
      badge: data.badge || null,
      is_featured: Boolean(data.is_featured),
      image_url: data.image_url,
      description: data.description,
      features: data.features || {},
      created_at: new Date().toISOString()
    };
    fallbackData.products.push(newProduct);
    persistFallback();
    return newProduct;
  },

  async updateProduct(id, data) {
    const numId = parseInt(id, 10);
    if (activeEngine === 'mysql') {
      const updates = [];
      const values = [];

      if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
      if (data.price !== undefined) { updates.push('price = ?'); values.push(data.price); }
      if (data.original_price !== undefined) { updates.push('original_price = ?'); values.push(data.original_price); }
      if (data.stock !== undefined) { updates.push('stock = ?'); values.push(data.stock); }
      if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
      if (data.image_url !== undefined) { updates.push('image_url = ?'); values.push(data.image_url); }
      if (data.badge !== undefined) { updates.push('badge = ?'); values.push(data.badge); }
      if (data.is_featured !== undefined) { updates.push('is_featured = ?'); values.push(data.is_featured ? 1 : 0); }
      if (data.category_id !== undefined) { updates.push('category_id = ?'); values.push(data.category_id); }
      if (data.category_name !== undefined) { updates.push('category_name = ?'); values.push(data.category_name); }
      if (data.features !== undefined) { updates.push('features = ?'); values.push(JSON.stringify(data.features)); }

      if (updates.length > 0) {
        values.push(numId);
        await pool.query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values);
      }
      return this.getProductById(numId);
    }

    const idx = fallbackData.products.findIndex(p => p.id === numId);
    if (idx === -1) return null;
    fallbackData.products[idx] = {
      ...fallbackData.products[idx],
      ...data,
      id: numId
    };
    persistFallback();
    return fallbackData.products[idx];
  },

  async deleteProduct(id) {
    const numId = parseInt(id, 10);
    if (activeEngine === 'mysql') {
      const [res] = await pool.query('DELETE FROM products WHERE id = ?', [numId]);
      return res.affectedRows > 0;
    }
    const idx = fallbackData.products.findIndex(p => p.id === numId);
    if (idx === -1) return false;
    fallbackData.products.splice(idx, 1);
    persistFallback();
    return true;
  },

  // Categories
  async getCategories() {
    if (activeEngine === 'mysql') {
      const [rows] = await pool.query('SELECT * FROM categories ORDER BY id ASC');
      return rows;
    }
    return fallbackData.categories;
  },

  // Users
  async findUserByEmail(email) {
    const normalized = email.toLowerCase().trim();
    if (activeEngine === 'mysql') {
      const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ?', [normalized]);
      return rows[0] || null;
    }
    return fallbackData.users.find(u => u.email.toLowerCase() === normalized) || null;
  },

  async findUserById(id) {
    const numId = parseInt(id, 10);
    if (activeEngine === 'mysql') {
      const [rows] = await pool.query('SELECT id, name, email, role, avatar, phone, address, created_at FROM users WHERE id = ?', [numId]);
      return rows[0] || null;
    }
    const u = fallbackData.users.find(u => u.id === numId);
    if (!u) return null;
    const { password, ...rest } = u;
    return rest;
  },

  async createUser(data) {
    const normalized = data.email.toLowerCase().trim();
    if (activeEngine === 'mysql') {
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role, avatar, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          data.name,
          normalized,
          data.password,
          data.role || 'user',
          data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          data.phone || null,
          data.address || null
        ]
      );
      return this.findUserById(result.insertId);
    }

    const newId = fallbackData.users.length ? Math.max(...fallbackData.users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      name: data.name,
      email: normalized,
      password: data.password,
      role: data.role || 'user',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: data.phone || null,
      address: data.address || null,
      created_at: new Date().toISOString()
    };
    fallbackData.users.push(newUser);
    persistFallback();
    const { password, ...safeUser } = newUser;
    return safeUser;
  },

  async updateUser(id, data) {
    const numId = parseInt(id, 10);
    if (activeEngine === 'mysql') {
      const updates = [];
      const values = [];
      if (data.name) { updates.push('name = ?'); values.push(data.name); }
      if (data.avatar) { updates.push('avatar = ?'); values.push(data.avatar); }
      if (data.phone) { updates.push('phone = ?'); values.push(data.phone); }
      if (data.address) { updates.push('address = ?'); values.push(data.address); }

      if (updates.length > 0) {
        values.push(numId);
        await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
      }
      return this.findUserById(numId);
    }

    const idx = fallbackData.users.findIndex(u => u.id === numId);
    if (idx === -1) return null;
    fallbackData.users[idx] = { ...fallbackData.users[idx], ...data, id: numId };
    persistFallback();
    const { password, ...safe } = fallbackData.users[idx];
    return safe;
  },

  // Orders
  async createOrder({ userId, items, totalAmount, discountAmount, shippingAmount, taxAmount, paymentMethod, shippingAddress }) {
    const orderNumber = `NEXA-${Math.floor(10000 + Math.random() * 90000)}`;

    if (activeEngine === 'mysql') {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        const [orderResult] = await connection.query(
          `INSERT INTO orders (order_number, user_id, total_amount, discount_amount, shipping_amount, tax_amount, status, payment_status, payment_method, shipping_address)
           VALUES (?, ?, ?, ?, ?, ?, 'Processing', 'Paid', ?, ?)`,
          [
            orderNumber,
            userId,
            totalAmount,
            discountAmount || 0,
            shippingAmount || 0,
            taxAmount || 0,
            paymentMethod || 'Simulated AI Pay (Card)',
            JSON.stringify(shippingAddress)
          ]
        );

        const orderId = orderResult.insertId;

        for (const item of items) {
          await connection.query(
            `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image_url)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [orderId, item.id || item.product_id, item.name || item.product_name, item.price, item.quantity, item.image_url]
          );

          // Decrement product stock
          await connection.query(
            `UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?`,
            [item.quantity, item.id || item.product_id]
          );
        }

        await connection.commit();
        connection.release();

        return this.getOrderById(orderId);
      } catch (err) {
        await connection.rollback();
        connection.release();
        throw err;
      }
    }

    const newId = fallbackData.orders.length ? Math.max(...fallbackData.orders.map(o => o.id)) + 1 : 1;
    const newOrder = {
      id: newId,
      order_number: orderNumber,
      user_id: parseInt(userId, 10),
      total_amount: parseFloat(totalAmount),
      discount_amount: parseFloat(discountAmount || 0),
      shipping_amount: parseFloat(shippingAmount || 0),
      tax_amount: parseFloat(taxAmount || 0),
      status: 'Processing',
      payment_status: 'Paid',
      payment_method: paymentMethod || 'Simulated AI Pay (Card)',
      shipping_address: shippingAddress,
      created_at: new Date().toISOString(),
      items: items.map((it, idx) => ({
        id: idx + 1,
        order_id: newId,
        product_id: it.id || it.product_id,
        product_name: it.name || it.product_name,
        price: parseFloat(it.price),
        quantity: parseInt(it.quantity, 10),
        image_url: it.image_url
      }))
    };

    // Update stock in fallback
    for (const item of items) {
      const prod = fallbackData.products.find(p => p.id === (item.id || item.product_id));
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    fallbackData.orders.unshift(newOrder);
    persistFallback();
    return newOrder;
  },

  async getOrdersByUserId(userId) {
    const numId = parseInt(userId, 10);
    if (activeEngine === 'mysql') {
      const [orderRows] = await pool.query(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [numId]
      );
      if (orderRows.length === 0) return [];

      const ordersWithItems = [];
      for (const order of orderRows) {
        const [items] = await pool.query(
          'SELECT * FROM order_items WHERE order_id = ?',
          [order.id]
        );
        ordersWithItems.push({
          ...order,
          shipping_address: typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address,
          items
        });
      }
      return ordersWithItems;
    }

    return fallbackData.orders.filter(o => o.user_id === numId);
  },

  async getOrderById(id) {
    const numId = parseInt(id, 10);
    if (activeEngine === 'mysql') {
      const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [numId]);
      if (orderRows.length === 0) return null;
      const order = orderRows[0];
      const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [numId]);
      return {
        ...order,
        shipping_address: typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address,
        items
      };
    }

    return fallbackData.orders.find(o => o.id === numId) || null;
  },

  async getAllOrders() {
    if (activeEngine === 'mysql') {
      const [orders] = await pool.query(
        `SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC`
      );
      const fullOrders = [];
      for (const o of orders) {
        const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
        fullOrders.push({
          ...o,
          shipping_address: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address,
          items
        });
      }
      return fullOrders;
    }

    return fallbackData.orders.map(o => {
      const customer = fallbackData.users.find(u => u.id === o.user_id);
      return {
        ...o,
        customer_name: customer ? customer.name : (o.shipping_address?.fullName || 'Alex Vance'),
        customer_email: customer ? customer.email : (o.shipping_address?.email || 'alex@nexacart.ai'),
        customer_phone: customer ? customer.phone : (o.shipping_address?.phone || '+91 98110 12345')
      };
    });
  },

  async updateOrderStatus(id, status) {
    const numId = parseInt(id, 10);
    if (activeEngine === 'mysql') {
      await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, numId]);
      return this.getOrderById(numId);
    }

    const order = fallbackData.orders.find(o => o.id === numId);
    if (order) {
      order.status = status;
      persistFallback();
    }
    return order;
  },

  // Reviews
  async getReviewsByProductId(productId) {
    const numId = parseInt(productId, 10);
    if (activeEngine === 'mysql') {
      const [rows] = await pool.query(
        'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
        [numId]
      );
      return rows;
    }
    return fallbackData.reviews.filter(r => r.product_id === numId);
  },

  async createReview({ productId, userId, userName, rating, comment }) {
    const numId = parseInt(productId, 10);
    if (activeEngine === 'mysql') {
      const [res] = await pool.query(
        'INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)',
        [numId, userId, userName, rating, comment]
      );

      // Recalculate product rating
      const [stats] = await pool.query(
        'SELECT AVG(rating) as avg_rating, COUNT(*) as rev_count FROM reviews WHERE product_id = ?',
        [numId]
      );
      await pool.query(
        'UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?',
        [parseFloat(stats[0].avg_rating).toFixed(2), stats[0].rev_count, numId]
      );

      return { id: res.insertId, product_id: numId, user_id: userId, user_name: userName, rating, comment, created_at: new Date() };
    }

    const newRev = {
      id: fallbackData.reviews.length + 1,
      product_id: numId,
      user_id: userId,
      user_name: userName,
      rating: parseInt(rating, 10),
      comment,
      created_at: new Date().toISOString()
    };
    fallbackData.reviews.push(newRev);

    // Update product rating
    const prodReviews = fallbackData.reviews.filter(r => r.product_id === numId);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    const prod = fallbackData.products.find(p => p.id === numId);
    if (prod) {
      prod.rating = parseFloat(avg.toFixed(2));
      prod.reviews_count = prodReviews.length;
    }

    persistFallback();
    return newRev;
  },

  // Analytics for Admin Dashboard
  async getAnalyticsSummary() {
    let ordersList, productsList, usersList;

    if (activeEngine === 'mysql') {
      const [orders] = await pool.query('SELECT total_amount, status, created_at FROM orders');
      const [products] = await pool.query('SELECT id, name, category_name, stock, price FROM products');
      const [users] = await pool.query('SELECT id, role, created_at FROM users');
      ordersList = orders;
      productsList = products;
      usersList = users;
    } else {
      ordersList = fallbackData.orders;
      productsList = fallbackData.products;
      usersList = fallbackData.users;
    }

    const totalRevenue = ordersList.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    const totalOrders = ordersList.length;
    const totalProducts = productsList.length;
    const totalCustomers = usersList.filter(u => u.role !== 'admin').length;
    const lowStockCount = productsList.filter(p => p.stock < 15).length;

    // Monthly sales simulation/grouping in INR (₹)
    const monthlySales = [
      { month: 'Jun', sales: 1840000, orders: 14 },
      { month: 'Jul', sales: 2420000, orders: 19 },
      { month: 'Aug', sales: 3150000, orders: 26 },
      { month: 'Sep', sales: 4290000, orders: 34 },
      { month: 'Oct', sales: 5820000, orders: 48 },
      { month: 'Nov', sales: Math.round(totalRevenue), orders: totalOrders }
    ];

    // Category distribution
    const categoryStats = {};
    for (const p of productsList) {
      categoryStats[p.category_name] = (categoryStats[p.category_name] || 0) + 1;
    }
    const categoryBreakdown = Object.entries(categoryStats).map(([name, count]) => ({
      category: name,
      count
    }));

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      lowStockCount,
      monthlySales,
      categoryBreakdown
    };
  }
};

