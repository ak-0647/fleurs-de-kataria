const mysql = require('mysql2/promise');
require('dotenv').config();

async function update() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [result] = await pool.query(
      "UPDATE flowers SET category = 'Mixed', color = 'Mixed', occasion = 'Just Because' WHERE image_url LIKE '%instagram%' AND category IS NULL"
    );
    console.log(`Updated ${result.affectedRows} Instagram flowers metadata.`);
  } catch (err) {
    console.error('Error updating metadata:', err);
  } finally {
    await pool.end();
    process.exit();
  }
}

update();
