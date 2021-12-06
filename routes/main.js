const express = require('express')
const nodemailer = require('nodemailer');
const router = express.Router()
const db = require('../models/db.js');


router.get('/', (req, res, next) => {
  const skills = db.get('skills').value();
  const products = db.get('products').value();
  res.render('pages/index', { title: 'Main page', products, skills })
})

router.post('/', async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.message) {
    req.flash('info', "Необходимо заполнить все поля");
    res.redirect('/');
  }

  const testAccount = await nodemailer.createTestAccount();
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: testAccount.user,
    subject: "Test letter",
    text: `${req.body.message.trim().slice(0, 400)} \n Отправлено с: <${req.body.email}>`
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  })

  transporter.sendMail(mailOptions, function (err) {
    if (err) {
      console.log(err);
      throw Error;
    }
    res.redirect('/');
  })

})

module.exports = router
