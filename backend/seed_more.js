const mysql = require('mysql2/promise');
require('dotenv').config();

async function addMore() {
    try {
        const pool = mysql.createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });
        
        await pool.query(`
            INSERT INTO flowers (name, description, price, image_url) VALUES 
            ('Signature Red Box', 'Our signature collection of fresh roses beautifully presented.', 5500.00, 'https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/643012767_17851417857685661_7504922364652505593_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2gFdi2x_8fJ8C1rVd-oykyDGqr3uFcqLJN1pLi6YG6Waz_VdxNzCdxcp30livQx7UZ926QsvWsE7Y-EKx7Ib5F_Z&_nc_ohc=jSkMlBkkegUQ7kNvwFrr0qX&_nc_gid=VMBy2hJK72Ulf_Z-3jeF-Q&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfyNLSAPrCPgXbTb-4SniH6pil4q9xWReHXavSS0XySaFw&oe=69C0DE81&_nc_sid=8b3546'),
            ('Blush Pink Box', 'Soft delicate pink roses expressing admiration and joy.', 4800.00, 'https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/649219217_17851615761685661_7456729820840052826_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=CZ-2aggPipEQ7kNvwHCP2rl&_nc_gid=VMBy2hJK72Ulf_Z-3jeF-Q&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfxMZaQIpmeyXsU0jo7WIx2nUOZsIMnkV4kdoJC0cLatHg&oe=69C0C3AC&_nc_sid=8b3546'),
            ('Classic White Roses', 'Pure white roses symbolizing elegance and new beginnings.', 5000.00, 'https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/641004514_17851245432685661_5036907889255913679_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=E03INnKEGUkQ7kNvwGAcR_C&_nc_gid=VMBy2hJK72Ulf_Z-3jeF-Q&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_Afw9sFLBWexRQK9tmtC_u76Ov8xLRWXcGy_WA29SNc7agg&oe=69C0C6FA&_nc_sid=8b3546'),
            ('Luxury Mixed Bouquet', 'A premium mix of seasonal blooms arranged to perfection.', 7500.00, 'https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/627080958_17844497367685661_772323440899502707_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=PCWOkonUpQcQ7kNvwHH7H6e&_nc_gid=JWCTBcq_XhR5uXrtdPo5Fw&edm=APU89FABAAAA&ccb=7-5&oh=00_AfwHNIheeQGtXmIv9g5m1a7qtKqM4h7DpJPZzg6HxLAX0g&oe=69C0C0FF&_nc_sid=bc0c2c'),
            ('Heart Shaped Arrangement', 'A romantic heart-shaped display of premium roses.', 6500.00, 'https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/623409951_17843457096685661_1669688547903233368_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=G_9tSEceoUMQ7kNvwFNEF6e&_nc_gid=JWCTBcq_XhR5uXrtdPo5Fw&edm=APU89FABAAAA&ccb=7-5&oh=00_AfzkefBNuC6Q9-h3KDCU2GBLzQIgOYEdTxXdUgeGdq_Jlg&oe=69C0DEE2&_nc_sid=bc0c2c'),
            ('Petite Blossom Box', 'A charming smaller box of our finest selected roses.', 3500.00, 'https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/625123175_17843866002685661_6934858656997294090_n.jpg?stp=c0.469.1206.1206a_dst-jpg_e15_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMjA2eDIxNDQuc2RyLmY4Mjc4Ny5kZWZhdWx0X2NvdmVyX2ZyYW1lLmMyIn0&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=9_ld8gbpcq8Q7kNvwGpe_PY&_nc_gid=JWCTBcq_XhR5uXrtdPo5Fw&edm=APU89FABAAAA&ccb=7-5&oh=00_Afy7iFkmpENIF1bVZiG5gKvVZeHTjf3Mc8eGUIyfziy3kQ&oe=69C0BF33&_nc_sid=bc0c2c')
        `);
        console.log("DB Updated Successfully with 6 MORE Instagram Images");
    } catch (err) {
        console.error("DB Update Failed:", err);
    }
    process.exit();
}
addMore();
