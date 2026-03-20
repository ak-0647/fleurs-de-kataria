const mysql = require('mysql2/promise');
require('dotenv').config();

async function backfill() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await pool.query('ALTER TABLE flowers ADD COLUMN category VARCHAR(50)');
    await pool.query('ALTER TABLE flowers ADD COLUMN color VARCHAR(50)');
    await pool.query('ALTER TABLE flowers ADD COLUMN occasion VARCHAR(50)');
  } catch(e) {}

  const [flowers] = await pool.query('SELECT id, name, description FROM flowers');
  
  for (const f of flowers) {
    let color = 'Mixed';
    let category = 'Mixed';
    let occasion = 'Just Because';
    
    let text = (f.name + ' ' + f.description).toLowerCase();
    
    if (text.includes('red')) color = 'Red';
    else if (text.includes('white')) color = 'White';
    else if (text.includes('pink') || text.includes('blush')) color = 'Pink';
    else if (text.includes('yellow') || text.includes('gold')) color = 'Yellow';
    else if (text.includes('purple') || text.includes('lavender')) color = 'Purple';
    
    if (text.includes('rose')) category = 'Rose';
    else if (text.includes('lily') || text.includes('lilies')) category = 'Lily';
    else if (text.includes('tulip')) category = 'Tulip';
    else if (text.includes('orchid')) category = 'Orchid';
    
    if (text.includes('wedding') || text.includes('bridal')) occasion = 'Wedding';
    else if (text.includes('sympathy') || text.includes('funeral')) occasion = 'Sympathy';
    else if (text.includes('birthday')) occasion = 'Birthday';
    else if (text.includes('anniversary') || text.includes('love') || text.includes('romance')) occasion = 'Anniversary';

    await pool.query('UPDATE flowers SET category = ?, color = ?, occasion = ? WHERE id = ?', [category, color, occasion, f.id]);
  }
  
  console.log('Backfill complete!');
  process.exit(0);
}
backfill();
