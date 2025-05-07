// File: app.js
const express = require('express');
const bodyParser = require('body-parser');
const mailgun = require('mailgun-js');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Mailgun Setup
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Send OTP Email
app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  const template = fs.readFileSync(path.join(__dirname, 'templates', 'otp.html'), 'utf8');
  const emailHtml = template.replace('{{otp}}', otp);

  const data = {
    from: 'ENTUGO <noreply@mg.entugo.in>',
    to: email,
    subject: 'Verify Your ENTUGO Account',
    html: emailHtml,
  };

  mg.messages().send(data, (error, body) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to send email');
    }
    console.log(body);
    res.send('OTP sent!');
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
