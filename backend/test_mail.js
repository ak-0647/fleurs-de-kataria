const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

console.log("Testing SMTP with:", process.env.SMTP_USER);

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Verification Failed:", error);
  } else {
    console.log("✅ SMTP Connection Successful!");
    
    transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "Fleurs de Kataria - Test Email",
      text: "If you are reading this, your email system is working perfectly!"
    }, (err, info) => {
      if (err) console.error("❌ SendMail Failed:", err);
      else console.log("✅ Test Email Sent! Check your Inbox/Spam.", info.response);
      process.exit();
    });
  }
});
