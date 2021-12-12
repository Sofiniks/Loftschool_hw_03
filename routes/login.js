const db = require('../models/db.js');
const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.session.isAdmin) {
    res.redirect('/admin')
  }
  const msglogin = req.flash('info')[0];
  res.render('pages/login', { title: 'SigIn page', msglogin })
})

router.post('/', (req, res, next) => {
  const user = db.get('user').value();
  const { email, password } = req.body;
  if (user.login === email && user.password === password) {
    req.session.isAdmin = true;
    res.redirect('/admin');

  } else {
    req.flash('info', 'Неправильный логин или пароль')
    res.redirect('/login');
  }

})

module.exports = router
