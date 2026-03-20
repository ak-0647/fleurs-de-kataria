const mysql = require('mysql2/promise');
require('dotenv').config();

async function update() {
    try {
        const pool = mysql.createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });
        
        await pool.query('ALTER TABLE flowers MODIFY COLUMN image_url TEXT');
        
        await pool.query('DELETE FROM flowers');
        await pool.query(`
            INSERT INTO flowers (name, description, price, image_url) VALUES 
            ('Crimson Velvet Box', 'A mesmerizing box of 50 deep red, velvety roses perfect for grand gestures.', 4500.00, 'https://instagram.fdel23-1.fna.fbcdn.net/v/t51.71878-15/629517228_1202202958737221_6822953715385915226_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2gGIs5XQfBYnegWidNArDYmCL5JWQ7fsM0mqbJzGXdBgyfvEV5mFMUDd_QkxCHRpaQdHcPXf2UdiKFrSgKmZiLhs&_nc_ohc=2qE91XK2sqQQ7kNvwFzM1Je&_nc_gid=USv0KUf1TwsOhEqT6x5hkg&edm=APU89FABAAAA&ccb=7-5&oh=00_Afx-eQFetPXfl162IJwtwt-nUq1NMRoTyzHr-ZrbiBOIeg&oe=69C0C310&_nc_sid=bc0c2c'),
            ('Brand Logo', 'Official Fleurs de Kataria brand identifier.', 1000.00, 'https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/628136204_17845131528685661_6646240236825381825_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2gGIs5XQfBYnegWidNArDYmCL5JWQ7fsM0mqbJzGXdBgyfvEV5mFMUDd_QkxCHRpaQdHcPXf2UdiKFrSgKmZiLhs&_nc_ohc=9wKso-W9iLAQ7kNvwHEGIAn&_nc_gid=USv0KUf1TwsOhEqT6x5hkg&edm=APU89FABAAAA&ccb=7-5&oh=00_AfxbW6BMNghUsBAKFh9wgJ0zeMBoVfx0ohfopXuZUQFYxg&oe=69C0BE49&_nc_sid=bc0c2c'),
            ('Rose Arrangement', 'A stunning arrangement of fresh roses for special occasions.', 6000.00, 'https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/627821075_17845384734685661_78342325919246331_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2gGIs5XQfBYnegWidNArDYmCL5JWQ7fsM0mqbJzGXdBgyfvEV5mFMUDd_QkxCHRpaQdHcPXf2UdiKFrSgKmZiLhs&_nc_ohc=UrREeMrZT5QQ7kNvwGo6oqp&_nc_gid=USv0KUf1TwsOhEqT6x5hkg&edm=APU89FABAAAA&ccb=7-5&oh=00_AfxbfYIKzDma-ybJxmrAUlB8xQbKKry10hCUEG-1OlykWw&oe=69C0D6AD&_nc_sid=bc0c2c')
        `);
        console.log("DB Updated Successfully with Instagram Images");
    } catch (err) {
        console.error("DB Update Failed:", err);
    }
    process.exit();
}
update();
