const fs = require('fs');
const https = require('https');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const urls = [
  "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.71878-15/629517228_1202202958737221_6822953715385915226_n.jpg?se=-1&stp=c0.248.640.640a_dst-jpegr_e15_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi42NDB4MTEzNi5oZHIuZjcxODc4Lm5mcmFtZV9jb3Zlcl9mcmFtZS5jMiJ9&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2gGPn6y7kNpoZCLe14UbKUesL1UbP_EcQoFuHEoF8NGYpkpBZ4HJMNsw0y-rvgQd6rSepxnjDvmLpWiqYcQvvyuX&_nc_ohc=2qE91XK2sqQQ7kNvwFzM1Je&_nc_gid=JWCTBcq_XhR5uXrtdPo5Fw&edm=APU89FABAAAA&ccb=7-5&oh=00_AfzG3hj2o5nBB162-6IXVAK1NtxWOGwrzXIMM1lA8WSwLg&oe=69C0C310&_nc_sid=bc0c2c",
  "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/628136204_17845131528685661_6646240236825381825_n.jpg?stp=c0.882.2268.2268a_dst-jpg_e15_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4yMjY4eDQwMzIuc2RyLmY4Mjc4Ny5kZWZhdWx0X2NvdmVyX2ZyYW1lLmMyIn0&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2gGPn6y7kNpoZCLe14UbKUesL1UbP_EcQoFuHEoF8NGYpkpBZ4HJMNsw0y-rvgQd6rSepxnjDvmLpWiqYcQvvyuX&_nc_ohc=9wKso-W9iLAQ7kNvwHEGIAn&_nc_gid=JWCTBcq_XhR5uXrtdPo5Fw&edm=APU89FABAAAA&ccb=7-5&oh=00_AfzGhOscKu2-VwtmkEabquq1siAdHG2H0NCteB9SwWJSCA&oe=69C0BE49&_nc_sid=bc0c2c",
  "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/627821075_17845384734685661_78342325919246331_n.jpg?stp=c0.432.1118.1118a_dst-jpg_e15_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMTE4eDE5ODIuc2RyLmY4Mjc4Ny5kZWZhdWx0X2NvdmVyX2ZyYW1lLmMyIn0&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2gGPn6y7kNpoZCLe14UbKUesL1UbP_EcQoFuHEoF8NGYpkpBZ4HJMNsw0y-rvgQd6rSepxnjDvmLpWiqYcQvvyuX&_nc_ohc=UrREeMrZT5QQ7kNvwGo6oqp&_nc_gid=JWCTBcq_XhR5uXrtdPo5Fw&edm=APU89FABAAAA&ccb=7-5&oh=00_AfxAHMWEyYjXUeiKD5wRHYy29XcLKmhF139tPyE2tVDDlA&oe=69C0D6AD&_nc_sid=bc0c2c",
  "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.71878-15/628215159_766965846463050_4484184041060962307_n.jpg?se=-1&stp=c0.248.640.640a_dst-jpegr_e15_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi42NDB4MTEzNi5oZHIuZjcxODc4Lm5mcmFtZV9jb3Zlcl9mcmFtZS5jMiJ9&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2gGPn6y7kNpoZCLe14UbKUesL1UbP_EcQoFuHEoF8NGYpkpBZ4HJMNsw0y-rvgQd6rSepxnjDvmLpWiqYcQvvyuX&_nc_ohc=JNPup5Cuz-EQ7kNvwGzI5Mq&_nc_gid=JWCTBcq_XhR5uXrtdPo5Fw&edm=APU89FABAAAA&ccb=7-5&oh=00_Afwx3hZxVw7x3upVK8q3xeo-eHpuezRq71o7lr5AmINelw&oe=69C0CA25&_nc_sid=bc0c2c",
  "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/626762144_17844911757685661_6404824225187602915_n.jpg?stp=c0.1250.3212.3212a_dst-jpg_e15_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4zMjEyeDU3MTIuc2RyLmY4Mjc4Ny5kZWZhdWx0X2NvdmVyX2ZyYW1lLmMyIn0&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2gGPn6y7kNpoZCLe14UbKUesL1UbP_EcQoFuHEoF8NGYpkpBZ4HJMNsw0y-rvgQd6rSepxnjDvmLpWiqYcQvvyuX&_nc_ohc=A0Ys-nvmr3MQ7kNvwExexNR&_nc_gid=JWCTBcq_XhR5uXrtdPo5Fw&edm=APU89FABAAAA&ccb=7-5&oh=00_AfwhzQZjX91HX2hXGuUNNyUqJ9s75xECfGojrdPwEsu6vA&oe=69C0B5DE&_nc_sid=bc0c2c",
  "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.71878-15/629593717_804625985997720_910853338382903611_n.jpg?se=-1&stp=c0.248.640.640a_dst-jpegr_e15_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi42NDB4MTEzNi5oZHIuZjcxODc4Lm5mcmFtZV9jb3Zlcl9mcmFtZS5jMiJ9&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=100&_nc_oc=Q6cZ2gGPn6y7kNpoZCLe14UbKUesL1UbP_EcQoFuHEoF8NGYpkpBZ4HJMNsw0y-rvgQd6rSepxnjDvmLpWiqYcQvvyuX&_nc_ohc=zhh_rjWVCIcQ7kNvwHUnMfH&_nc_gid=JWCTBcq_XhR5uXrtdPo5Fw&edm=APU89FABAAAA&ccb=7-5&oh=00_AfxgnW7XZUhTkCZywz2SBk4Vx-iVVbv_BaDq0U6m7uuE6Q&oe=69C0E4C7&_nc_sid=bc0c2c",
  "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/625123175_17843866002685661_6934858656997294090_n.jpg?stp=c0.469.1206.1206a_dst-jpg_e15_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMjA2eDIxNDQuc2RyLmY4Mjc4Ny5kZWZhdWx0X2NvdmVyX2ZyYW1lLmMyIn0&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2gGPn6y7kNpoZCLe14UbKUesL1UbP_EcQoFuHEoF8NGYpkpBZ4HJMNsw0y-rvgQd6rSepxnjDvmLpWiqYcQvvyuX&_nc_ohc=9_ld8gbpcq8Q7kNvwGpe_PY&_nc_gid=JWCTBcq_XhR5uXrtdPo5Fw&edm=APU89FABAAAA&ccb=7-5&oh=00_Afy7iFkmpENIF1bVZiG5gKvVZeHTjf3Mc8eGUIyfziy3kQ&oe=69C0BF33&_nc_sid=bc0c2c",
  "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/626278445_17844097161685661_3063086392907674725_n.jpg?stp=dst-jpg_e35_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMDI0eDEwMjQuc2RyLmY4Mjc4Ny5kZWZhdWx0X2ltYWdlLmMyIn0&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2gGPn6y7kNpoZCLe14UbKUesL1UbP_EcQoFuHEoF8NGYpkpBZ4HJMNsw0y-rvgQd6rSepxnjDvmLpWiqYcQvvyuX&_nc_ohc=-goiGUo6iHAQ7kNvwGw15Sn&_nc_gid=JWCTBcq_XhR5uXrtdPo5Fw&edm=APU89FABAAAA&ccb=7-5&oh=00_AfwFGEptor-UY9u8Id8X1OiIvyH_0aw6MJwmkx2m1QsGDw&oe=69C0C68C&_nc_sid=bc0c2c",
  "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.71878-15/624483336_910789978501567_2480238124705429245_n.jpg?se=-1&stp=c0.248.640.640a_dst-jpegr_e15_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi42NDB4MTEzNi5oZHIuZjcxODc4Lm5mcmFtZV9jb3Zlcl9mcmFtZS5jMiJ9&_nc_ht=instagram.fdel23-1.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2gGPn6y7kNpoZCLe14UbKUesL1UbP_EcQoFuHEoF8NGYpkpBZ4HJMNsw0y-rvgQd6rSepxnjDvmLpWiqYcQvvyuX&_nc_ohc=n-Rpvy5qtqYQ7kNvwHL4Hhp&_nc_gid=JWCTBcq_XhR5uXrtdPo5Fw&edm=APU89FABAAAA&ccb=7-5&oh=00_AfwFN87jqXXCFTvNuTzonx4KJKwp53qSoLTeF3zlg05NgQ&oe=69C0C43A&_nc_sid=bc0c2c"
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (clientRes) => {
      if (clientRes.statusCode !== 200) return resolve('Failed ' + clientRes.statusCode);
      const fileStream = fs.createWriteStream(filepath);
      clientRes.pipe(fileStream);
      fileStream.on('finish', () => resolve('Success'));
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

const dir = path.join(__dirname, '../frontend/public/images');

async function run() {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  console.log("Downloading 9 images...");
  for (let i = 0; i < urls.length; i++) {
    const r = await downloadImage(urls[i], path.join(dir, `ig_${i}.jpg`));
    console.log(`ig_${i}.jpg:`, r);
  }
  try {
    const pool = mysql.createPool({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
    await pool.query('DELETE FROM flowers');
    await pool.query(`
      INSERT INTO flowers (name, description, price, image_url) VALUES 
      ('Crimson Velvet Box', 'A mesmerizing box of deep red, velvety roses perfect for grand gestures.', 4500.00, '/images/ig_0.jpg'),
      ('Brand Aesthetic', 'Official Fleurs de Kataria brand identifier.', 1000.00, '/images/ig_1.jpg'),
      ('Rose Arrangement', 'A stunning arrangement of fresh roses for special occasions.', 6000.00, '/images/ig_2.jpg'),
      ('Signature Red Box', 'Our signature collection of fresh roses beautifully presented.', 5500.00, '/images/ig_3.jpg'),
      ('Blush Pink Box', 'Soft delicate pink roses expressing admiration and joy.', 4800.00, '/images/ig_4.jpg'),
      ('Classic Bloom Box', 'Pure classic roses symbolizing elegance and new beginnings.', 5000.00, '/images/ig_5.jpg'),
      ('Luxury Mixed Bouquet', 'A premium mix of seasonal blooms arranged to perfection.', 7500.00, '/images/ig_6.jpg'),
      ('Velvet Noir Arrangement', 'A romantic display of premium dark roses.', 6500.00, '/images/ig_7.jpg'),
      ('Petite Rose Handful', 'A charming smaller box of our finest selected roses.', 3500.00, '/images/ig_8.jpg')
    `);
    console.log("DB Updated with EXACT INSTAGRAM paths!");
  } catch (err) {
    console.error("DB Error:", err);
  }
  process.exit();
}
run();
