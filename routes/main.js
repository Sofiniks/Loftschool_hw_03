const express = require('express')
const nodemailer = require('nodemailer');
const router = express.Router()
const db = require('../models/db.js');


router.get('/', (req, res, next) => {
  const skills = db.get('skills').value();
  const products = db.get('products').value();
  const msgemail = req.flash('info')[0];
  res.render('pages/index', { title: 'Main page', products, skills, msgemail })
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
      req.flash('info', 'При отправке возникла ошибка')
      throw Error;
    }
    req.flash('info', 'Письмо успешно отправлено')
    res.redirect('/');
  })

})

module.exports = router
