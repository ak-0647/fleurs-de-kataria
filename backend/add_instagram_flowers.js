const fs = require('fs');
const https = require('https');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const data = [
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/643012767_17851417857685661_7504922364652505593_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6",
    "description": "She deserves flowers today and every day 🌸 Happy Women’s Day ✨"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/622291344_17842881084685661_7570566354949098774_n.jpg?stp=dst-jpg_e15_tt6",
    "description": "A new kind of elegance is coming 🌹 Stay tuned ✨"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/651726368_17852997492685661_2450863034844875584_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6",
    "description": "Send this to someone who owes you Eidi 💕 DM for orders 💌✨"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/651168260_17852651256685661_9173673197355725516_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6",
    "description": "Tag the person who deserves flowers . . . . . . #blueaesthetic #giftideas"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.71878-15/648394874_4102492823347715_2859981632904077715_n.jpg?stp=dst-jpg_e15_tt6",
    "description": "Imagine their smile when they receive this bouquet 🌹✨"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/649219217_17851615761685661_7456729820840052826_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6",
    "description": "Tag someone who deserves these flowers 🌹"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/641004514_17851245432685661_5036907889255913679_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6",
    "description": "A small bouquet for the strongest women 💐❤️ Women’s Day special"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/638922813_17849526228685661_5386812027398004158_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6",
    "description": "When effort speaks louder than words 💫 This isn’t just a gift 💎"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.71878-15/639682097_2166136070587781_5839166650018225378_n.jpg?stp=dst-jpg_e15_tt6",
    "description": "She said she likes chocolates… so I did this 💅🍫"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/639484394_17848542330685661_3560644563205375628_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6",
    "description": "He brought me what he said… 💙 Bare minimum is rare these days 💭✨"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/630488197_17847142338685661_8105642850679326393_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6",
    "description": "From morning surprises to last minute deliveries ❤️✨"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.71878-15/632264065_893980049886432_576394527425930257_n.jpg?stp=dst-jpg_e15_tt6",
    "description": "A bouquet full of memories, love & gratitude 💐🤍"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/628136204_17845131528685661_6646240236825381825_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6",
    "description": "Custom bouquets for every moment ❤️✨"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/627821075_17845384734685661_78342325919246331_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6",
    "description": "Fresh look • Forever life • Handmade luxury 💛"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.71878-15/628215159_766965846463050_4484184041060962307_n.jpg?stp=dst-jpg_e15_tt6",
    "description": "Simple. Elegant. Sweet. 🍫✨ Custom chocolate bouquets"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/626762144_17844911757685661_6404824225187602915_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6",
    "description": "Different chocolates, same handcrafted love 🍫"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.71878-15/629593717_804625985997720_910853338382903611_n.jpg?stp=dst-jpg_e15_tt6",
    "description": "Making a chocolate bouquet step-by-step 🍫✨"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/625123175_17843866002685661_6934858656997294090_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6",
    "description": "A bouquet sweeter than love itself 🍫🌸"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/626278445_17844097161685661_3063086392907674725_n.jpg?stp=dst-jpg_e15_tt6",
    "description": "Lost in thoughts made of flowers 🌸🤍"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.71878-15/624483336_910789978501567_2480238124705429245_n.jpg?stp=dst-jpg_e15_tt6",
    "description": "Not just flowers little things that last ❤️"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/627080958_17844497367685661_772323440899502707_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6",
    "description": "Crafted with care for your special moments 🌹"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/623409951_17843457096685661_1669688547903233368_n.jpg?stp=dst-jpg_e15_tt6",
    "description": "Penguins v samajh gaye… tusi kad samjhoge? 🐧💐"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.82787-15/623512455_17843069364685661_2783014573690931505_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6",
    "description": "Handmade bouquets, made to last forever❤️"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.71878-15/629517228_1202202958737221_6822953715385915226_n.jpg?stp=dst-jpg_e15_tt6",
    "description": "Custom handmade floral luxury ✨"
  },
  {
    "url": "https://instagram.fdel23-1.fna.fbcdn.net/v/t51.71878-15/629517228_1202202958737221_6822953715385915226_n.jpg?stp=dst-jpg_e15_tt6",
    "description": "A touch of magic in every bouquet 🌸✨"
  }
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.instagram.com/'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .on('close', resolve);
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

function generateName(description) {
  let cleaned = description.split('🌸')[0].split('🌹')[0].split('✨')[0].split('|')[0].trim();
  cleaned = cleaned.replace(/[#@\n\r]/g, ' ').split('  ')[0];
  if (cleaned.length > 30) cleaned = cleaned.substring(0, 27) + '...';
  if (!cleaned || cleaned.length < 3) cleaned = "Bespoke Creation";
  return cleaned;
}

const imagesDir = path.join(__dirname, '../frontend/public/images/instagram');

async function run() {
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const files = fs.readdirSync(imagesDir).filter(f => f.startsWith('ig_') && f.endsWith('.jpg'));
  console.log(`Found ${files.length} existing Instagram images.`);

  console.log(`Starting migration of ${Math.min(data.length, files.length)} images...`);

  for (let i = 0; i < files.length && i < data.length; i++) {
    const filename = files[i];
    const item = data[i];
    const relativeUrl = `/images/instagram/${filename}`;

    try {
      const name = generateName(item.description);
      const price = 3500.00 + (Math.random() * 2000); // Random luxury price

      await pool.query(
        'INSERT INTO flowers (name, description, price, image_url) VALUES (?, ?, ?, ?)',
        [name, item.description, price.toFixed(2), relativeUrl]
      );
      console.log(`[${i+1}/${files.length}] Added: ${name}`);
    } catch (err) {
      console.error(`Error processing item ${i}:`, err.message);
    }
  }

  console.log("Migration complete!");
  process.exit();
}

run();
