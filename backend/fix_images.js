const mysql = require('mysql2/promise');
require('dotenv').config();

async function fix() {
    try {
        const pool = mysql.createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });
        
        await pool.query('DELETE FROM flowers');
        
        await pool.query(`
            INSERT INTO flowers (name, description, price, image_url) VALUES 
            ('Crimson Velvet Box', 'A mesmerizing box of deep red, velvety roses perfect for grand gestures.', 4500.00, 'https://images.unsplash.com/photo-1548509925-0e7ea55d6486?auto=format&fit=crop&q=80&w=800'),
            ('Signature Red Box', 'Our signature collection of fresh roses beautifully presented.', 5500.00, 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=800'),
            ('Rose Arrangement', 'A stunning arrangement of fresh roses for special occasions.', 6000.00, 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80&w=800'),
            ('Brand Aesthetic', 'Official Fleurs de Kataria brand identifier.', 1000.00, 'https://images.unsplash.com/photo-1490750967868-88cb44cb271c?auto=format&fit=crop&q=80&w=800'),
            ('Blush Pink Box', 'Soft delicate pink roses expressing admiration and joy.', 4800.00, 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800'),
            ('Classic White Roses', 'Pure white roses symbolizing elegance and new beginnings.', 5000.00, 'https://images.unsplash.com/photo-1584024345025-a1c1d1a6c0fb?auto=format&fit=crop&q=80&w=800'),
            ('Luxury Mixed Bouquet', 'A premium mix of seasonal blooms arranged to perfection.', 7500.00, 'https://images.unsplash.com/photo-1596489373974-95da6cf601cc?auto=format&fit=crop&q=80&w=800'),
            ('Heart Shaped Arrangement', 'A romantic heart-shaped display of premium roses.', 6500.00, 'https://images.unsplash.com/photo-1550091007-df0bb09dcfcb?auto=format&fit=crop&q=80&w=800'),
            ('Petite Blossom Box', 'A charming smaller box of our finest selected roses.', 3500.00, 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800')
        `);
        console.log("DB Fixed Successfully with permanent images");
    } catch (err) {
        console.error("DB Fix Failed:", err);
    }
    process.exit();
}
fix();
