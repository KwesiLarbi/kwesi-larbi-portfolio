const express = require('express');
const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const dotenv = require('dotenv');
const router = express.Router();
dotenv.config();

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API,
    domain: process.env.MAILGUN_DOMAIN
  }
};

const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (name, email, phone, company, projectType, budget, title, message, cb) => {
  const mailOptions = {
    sender: name,
    from: email,
    to: 'kwesiiilarb@gmail.com',
    subject: title,
    text: { company, phone, projectType, budget, message },
    html: `<p>Company: ${company}</p><p>Phone: ${phone}</p><p>Project Type: ${projectType}</p><p>Budget: ${budget}</p><p>Message: ${message}</p>`
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data);
    }
  });
};

/* GET contact page. */
router.get('/', function(req, res, next) {
  res.render('contact');
});

// Send email
router.post('/', (req, res) => {
  const { name, email, phone, company, projectType, budget, title, message } = req.body;
  console.log('Data: ', req.body);

  sendMail(name, email, phone, company, projectType, budget, title, message, function(err, data) {
    if (err) {
      res.status(500).json({ message: 'Internal Error' });
    } else {
      res.status({ message: 'Email sent!' });
    }
  });
});

/*router.post('/', (req, res) => {
  // Send dummy email
  console.log('Data:', req.body);
  res.json({ message: 'Message received!' });
});*/

module.exports = router;