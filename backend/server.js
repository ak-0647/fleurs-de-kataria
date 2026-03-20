const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Ensure DB pool is ready for all API requests
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api') && req.path !== '/api/health') {
    try {
      await getPool();
      next();
    } catch (err) {
      return res.status(500).json({ error: 'Database connection failed. Please try again in 10 seconds.' });
    }
  } else {
    next();
  }
});

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    const db = await getPool();
    res.json({ status: 'ok', db_connected: true });
  } catch (err) {
    res.status(500).json({ status: 'error', db_connected: false, error: err.message });
  }
});

const uploadDir = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir) },
  filename: function (req, file, cb) { cb(null, Date.now() + path.extname(file.originalname)) }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static(uploadDir));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) console.error("SMTP Error:", error);
  else console.log("✨ Email system is ready to send notifications!");
});

const PORT = process.env.PORT || 5000;
let pool;
let isInitializing = false;

async function getPool() {
  if (pool) return pool;
  if (isInitializing) {
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (pool) return pool;
    }
  }
  isInitializing = true;
  try {
    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 4000,
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    };
    try {
      const tempPool = mysql.createPool({ ...dbConfig, database: process.env.DB_NAME });
      await tempPool.query('SELECT 1');
      pool = tempPool;
    } catch (dbErr) {
      const connection = await mysql.createConnection(dbConfig);
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
      await connection.end();
      pool = mysql.createPool({ ...dbConfig, database: process.env.DB_NAME });
    }

    // Always run schema check/seed to ensure completeness
    await initSchemas(pool);

    return pool;
  } catch (err) {
    console.error('DB Init Error:', err);
    throw err;
  } finally {
    isInitializing = false;
  }
}

// Keep a simple initDB for legacy calls if any, but it now uses getPool
async function initDB() {
  await getPool();
}

async function initSchemas(p) {
  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role VARCHAR(20) DEFAULT 'USER',
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        sec_question VARCHAR(255),
        sec_answer VARCHAR(255),
        password_hash VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(10) NOT NULL,
        purpose VARCHAR(50) DEFAULT 'VERIFY',
        expires_at DATETIME NOT NULL
      );
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS flowers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url TEXT,
        category VARCHAR(50),
        color VARCHAR(50),
        occasion VARCHAR(50)
      );
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        total_amount DECIMAL(10, 2) NOT NULL,
        delivery_address TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        delivery_personnel VARCHAR(255),
        delivery_time DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        flower_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (flower_id) REFERENCES flowers(id) ON DELETE CASCADE
      );
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS custom_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        flower_selection TEXT,
        wrapping_style VARCHAR(100),
        ribbon_color VARCHAR(50),
        note TEXT,
        image_path TEXT,
        budget VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Seed initial flowers if empty
    const [flowerCount] = await p.query('SELECT COUNT(*) as count FROM flowers');
    if (flowerCount[0].count === 0) {
      console.log('🌱 Seeding initial masterpieces...');
      const initialFlowers = [
        ['Royal Velvet Rose', 'A deep crimson rose of unparalleled elegance, perfect for grand gestures.', 2499, 'https://images.unsplash.com/photo-1548610762-7c6abcd94368?auto=format&fit=crop&q=80', 'Rose', 'Red', 'Anniversary'],
        ['Midnight Orchid', 'Rare purple orchid that blooms with a mysterious aura and sweet fragrance.', 3899, 'https://images.unsplash.com/photo-1534885391148-4330f509164d?auto=format&fit=crop&q=80', 'Orchid', 'Purple', 'Just Because'],
        ['Summer Sun Lily', 'Vibrant golden lilies that bring the warmth of summer to any space.', 1899, 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=80', 'Lily', 'Yellow', 'Birthday'],
        ['Pearlescent Tulip', 'Soft white tulips with a subtle shimmer, symbolizing purity and new beginnings.', 1599, 'https://images.unsplash.com/photo-1544833332-9cb5259cf59d?auto=format&fit=crop&q=80', 'Tulip', 'White', 'Wedding'],
        ['Blushing Peony', 'Luxurious pink peonies with layers of delicate petals, an absolute showstopper.', 4299, 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80', 'Mixed', 'Pink', 'Anniversary']
      ];
      for (const f of initialFlowers) {
        await p.query('INSERT INTO flowers (name, description, price, image_url, category, color, occasion) VALUES (?, ?, ?, ?, ?, ?, ?)', f);
      }
    }

    console.log('Database schemas initialized safely.');
  } catch (err) {
    console.error('Failed to initialize database schemas:', err);
  }
}


// ================= AUTH ROUTES ================= 

app.post('/api/auth/register', async (req, res) => {
  try {
    const { full_name, email, phone, sec_question, sec_answer, password } = req.body;
    
    // Force a single Master Admin account for demonstration (optional)
    const role = email.includes('admin') ? 'ADMIN' : 'USER';
    
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      if (existing[0].is_verified) {
         return res.status(400).json({ error: 'Email already registered and verified.' });
      } else {
         await pool.query('DELETE FROM users WHERE email = ?', [email]);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    await pool.query(
      'INSERT INTO users (role, full_name, email, phone, sec_question, sec_answer, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [role, full_name, email, phone, sec_question, sec_answer, hash]
    );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await pool.query('DELETE FROM otps WHERE email = ? AND purpose = ?', [email, 'VERIFY']);
    await pool.query(
      'INSERT INTO otps (email, otp, purpose, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))',
      [email, otp, 'VERIFY']
    );

    await transporter.sendMail({
      from: `"Fleurs de Kataria Auth" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Fleurs de Kataria - Verify your account',
      html: `
        <div style="font-family: sans-serif; background: #050308; color: #FFF; padding: 40px; text-align: center; border-radius: 8px;">
          <h2 style="color: #FBE29F; font-style: italic;">Fleurs de Kataria</h2>
          <h3>Welcome ${full_name}!</h3>
          <p>Please use the following OTP to verify your account registration:</p>
          <div style="background: #E60045; color: white; border-radius: 4px; padding: 15px; font-size: 24px; letter-spacing: 5px; margin: 20px auto; max-width: 200px;">
            <strong>${otp}</strong>
          </div>
          <p style="color: #A19BAA; font-size: 12px;">This code expires in 10 minutes.</p>
        </div>
      `
    });

    res.json({ message: 'OTP sent to email. Please verify.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const [rows] = await pool.query('SELECT * FROM otps WHERE email = ? AND otp = ? AND purpose = ? AND expires_at > NOW()', [email, otp, 'VERIFY']);
    
    if (rows.length === 0) return res.status(400).json({ error: 'Invalid or expired OTP.' });
    
    await pool.query('UPDATE users SET is_verified = TRUE WHERE email = ?', [email]);
    await pool.query('DELETE FROM otps WHERE email = ? AND purpose = ?', [email, 'VERIFY']);
    
    res.json({ message: 'Account verified successfully! You can now login.' });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body; 
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(400).json({ error: 'Invalid credentials.' });
    
    const user = users[0];
    if (!user.is_verified) return res.status(403).json({ error: 'Please verify your email first.' });
    
    if (role === 'ADMIN' && user.role !== 'ADMIN') return res.status(403).json({ error: 'Access denied. You are not an admin.' });
    
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });
    
    const payload = { id: user.id, email: user.email, role: user.role, name: user.full_name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token, user: payload, message: 'Logged in successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.json({ message: 'If email exists, an OTP will be sent.' }); 
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await pool.query('DELETE FROM otps WHERE email = ? AND purpose = ?', [email, 'RESET']);
    await pool.query(
      'INSERT INTO otps (email, otp, purpose, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))',
      [email, otp, 'RESET']
    );

    await transporter.sendMail({
      from: `"Fleurs de Kataria Auth" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: sans-serif; padding: 30px;">
          <h3>Password Reset Request</h3>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>It expires in 10 minutes.</p>
        </div>
      `
    });

    res.json({ message: 'OTP sent to your email.' });
  } catch (err) {
    res.status(500).json({ error: 'Request failed: ' + err.message });
  }
});

// TEMPORARY: Force reset password for recovery
app.post('/api/auth/force-reset-admin', async (req, res) => {
  try {
    const { email, new_password, secret } = req.body;
    if (secret !== 'fleurs_secret_999') return res.status(403).json({ error: 'Unauthorized' });
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(new_password, salt);
    
    await pool.query('UPDATE users SET password_hash = ? WHERE email = ?', [hash, email]);
    res.json({ message: 'Password reset successful for ' + email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, new_password } = req.body;
    
    const [rows] = await pool.query('SELECT * FROM otps WHERE email = ? AND otp = ? AND purpose = ? AND expires_at > NOW()', [email, otp, 'RESET']);
    if (rows.length === 0) return res.status(400).json({ error: 'Invalid or expired OTP.' });
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(new_password, salt);
    
    await pool.query('UPDATE users SET password_hash = ? WHERE email = ?', [hash, email]);
    await pool.query('DELETE FROM otps WHERE email = ? AND purpose = ?', [email, 'RESET']);
    
    res.json({ message: 'Password reset successful. You can login now.' });
  } catch (err) {
    res.status(500).json({ error: 'Reset failed.' });
  }
});

// ================= EXISTING DATA ROUTES ================= 

app.get('/api/flowers', async (req, res) => {
  try {
    if (!pool) return res.status(500).json({ error: 'Database not initialized' });
    let query = 'SELECT * FROM flowers WHERE 1=1';
    const params = [];

    const { category, color, occasion, price_min, price_max, search } = req.query;
    
    if (category) { query += ' AND category = ?'; params.push(category); }
    if (color) { query += ' AND color = ?'; params.push(color); }
    if (occasion) { query += ' AND occasion = ?'; params.push(occasion); }
    if (price_min) { query += ' AND price >= ?'; params.push(price_min); }
    if (price_max) { query += ' AND price <= ?'; params.push(price_max); }
    if (search) { 
      query += ' AND (name LIKE ? OR description LIKE ?)'; 
      params.push(`%${search}%`, `%${search}%`); 
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flowers' });
  }
});

// Admin Middleware
const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    if (user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required' });
    req.user = user;
    next();
  });
};

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- USER ORDERS (Moved for hoisting) ---
app.get('/api/orders', authenticateUser, async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const [items] = await pool.query(
        `SELECT oi.*, f.name, f.image_url 
         FROM order_items oi 
         JOIN flowers f ON oi.flower_id = f.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      return { ...order, items };
    }));
    res.json(ordersWithItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/api/user/custom-requests', authenticateUser, async (req, res) => {
  try {
    const [requests] = await pool.query(
      'SELECT * FROM custom_requests WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/orders', authenticateUser, async (req, res) => {
  try {
    const { items, delivery_address, total_amount } = req.body;
    const userId = req.user.id;
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, total_amount, delivery_address) VALUES (?, ?, ?)',
        [userId, total_amount, delivery_address]
      );
      const orderId = orderResult.insertId;

      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, flower_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.flower_id, item.quantity, item.price]
        );
      }

      await connection.commit();
      connection.release();

      // Send confirmation email inside background
      const [userRows] = await pool.query('SELECT email FROM users WHERE id = ?', [userId]);
      if (userRows.length > 0) {
        const recipient = userRows[0].email;
        console.log(`📧 Attempting to send order confirmation to: ${recipient}`);

        transporter.sendMail({
          from: `"Fleurs de Kataria" <${process.env.SMTP_USER}>`,
          to: recipient,
          subject: `Order Confirmation - #${orderId}`,
          html: `<h3>Thank you for your order!</h3><p>Your Order ID is <strong>#${orderId}</strong>. Total Amount: <strong>₹${total_amount}</strong>.</p><p>We have received your order and are currently preparing it with love.</p>`
        }).then(() => console.log(`✅ Confirmation email sent to ${recipient}`))
          .catch(e => console.error(`❌ Email failed for ${recipient}:`, e));
        
        // Notify Admin
        transporter.sendMail({
          from: `"Fleurs de Kataria System" <${process.env.SMTP_USER}>`,
          to: process.env.SMTP_USER,
          subject: `✨ New Order Alert - #${orderId}`,
          html: `<p>A new order (ID: #${orderId}) for ₹${total_amount} has been placed by ${recipient}.</p>`
        }).then(() => console.log(`🔔 Admin alerted for Order #${orderId}`))
          .catch(e => console.error("Admin Alert failed:", e));
      } else {
        console.warn(`⚠️ No user found with ID ${userId}, skipping email.`);
      }

      res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

app.post('/api/custom-requests', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    const { flower_selection, wrapping_style, ribbon_color, note, budget } = req.body;
    const image_path = req.file ? '/uploads/' + req.file.filename : null;
    const userId = req.user.id;

    await pool.query(
      'INSERT INTO custom_requests (user_id, flower_selection, wrapping_style, ribbon_color, note, image_path, budget) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, flower_selection, wrapping_style, ribbon_color, note, image_path, budget]
    );

    // Notify Admin via Email
    const [userRows] = await pool.query('SELECT email, full_name FROM users WHERE id = ?', [userId]);
    if (userRows.length > 0) {
      transporter.sendMail({
        from: `"Fleurs de Kataria System" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `🎨 New Custom Request Alert`,
        html: `
          <h3>New Bespoke Creation Request</h3>
          <p><strong>Customer:</strong> ${userRows[0].full_name} (${userRows[0].email})</p>
          <p><strong>Flower Selection:</strong> ${flower_selection}</p>
          <p><strong>Budget:</strong> ₹${budget || 'Not specified'}</p>
          <p>Check the Admin Dashboard for full details and attachments.</p>
        `
      }).catch(e => console.error("Admin Custom Email fail:", e));
    }

    res.status(201).json({ message: 'Custom request submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit custom request' });
  }
});

app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, u.full_name, u.email, u.phone 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);
    
    for (let order of rows) {
      const [items] = await pool.query('SELECT oi.*, f.name, f.image_url FROM order_items oi JOIN flowers f ON oi.flower_id = f.id WHERE oi.order_id = ?', [order.id]);
      order.items = items;
    }
    
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/admin/orders/:id', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, u.full_name, u.email, u.phone 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      WHERE o.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    
    const order = rows[0];
    const [items] = await pool.query(`
      SELECT oi.*, f.name, f.image_url 
      FROM order_items oi 
      JOIN flowers f ON oi.flower_id = f.id 
      WHERE oi.order_id = ?
    `, [order.id]);
    
    order.items = items;
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

app.put('/api/admin/orders/:id', authenticateAdmin, async (req, res) => {
  try {
    const { status, delivery_personnel, delivery_time } = req.body;
    
    const [oldRows] = await pool.query('SELECT o.*, u.email, u.full_name FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?', [req.params.id]);

    await pool.query(
      'UPDATE orders SET status = ?, delivery_personnel = ?, delivery_time = ? WHERE id = ?',
      [status || 'Pending', delivery_personnel || null, delivery_time || null, req.params.id]
    );

    if (oldRows.length > 0 && oldRows[0].status !== status) {
       let message = `Your order #${req.params.id} status has been updated to: <strong>${status}</strong>.`;
       if (status === 'Preparing') message = `Great news! We have started preparing your order #${req.params.id}.`;
       else if (status === 'Out for Delivery') message = `Your order #${req.params.id} is out for delivery!`;
       else if (status === 'Delivered') message = `Your order #${req.params.id} has been delivered successfully.`;
       
       transporter.sendMail({
          from: `"Fleurs de Kataria" <${process.env.SMTP_USER}>`,
          to: oldRows[0].email,
          subject: `Order Update - #${req.params.id}`,
          html: `<p>Hello ${oldRows[0].full_name},</p><p>${message}</p>`
       }).catch(e => console.error(e));
    }

    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

app.get('/api/admin/custom-requests', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT cr.*, u.full_name, u.email, u.phone 
      FROM custom_requests cr 
      LEFT JOIN users u ON cr.user_id = u.id 
      ORDER BY cr.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch custom requests' });
  }
});

app.put('/api/admin/custom-requests/:id', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE custom_requests SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Request status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update custom request status' });
  }
});

// ================= ADMIN CATALOG ROUTES =================

app.get('/api/admin/flowers', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM flowers ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flowers' });
  }
});

app.post('/api/admin/flowers', authenticateAdmin, async (req, res) => {
  try {
    const { name, description, price, image_url, category, color, occasion } = req.body;
    await pool.query(
      'INSERT INTO flowers (name, description, price, image_url, category, color, occasion) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, image_url, category, color, occasion]
    );
    res.status(201).json({ message: 'Flower added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add flower' });
  }
});

app.put('/api/admin/flowers/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, description, price, image_url, category, color, occasion } = req.body;
    await pool.query(
      'UPDATE flowers SET name = ?, description = ?, price = ?, image_url = ?, category = ?, color = ?, occasion = ? WHERE id = ?',
      [name, description, price, image_url, category, color, occasion, req.params.id]
    );
    res.json({ message: 'Flower updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update flower' });
  }
});

app.delete('/api/admin/flowers/:id', authenticateAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM flowers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Flower deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete flower' });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    if (!pool) return res.status(500).json({ error: 'Database not initialized' });
    const { name, email, message } = req.body;
    await pool.query(
      'INSERT INTO inquiries (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    res.status(201).json({ success: true, message: 'Inquiry received' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));
app.get(/.*/, (req, res) => {
  if(req.url.startsWith('/api')) return res.status(404).json({error: 'Not found'});
  res.sendFile(path.join(frontendPath, 'index.html'));
});

initDB().then(() => {
  console.log("Database initialization finished.");
}).catch(err => {
  console.error("Critical DB error:", err);
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
