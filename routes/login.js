const db = require('../models/db.js');
const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.session.isAdmin) {
    res.redirect('/admin')
  }
  res.render('pages/login', { title: 'SigIn page' })
})

router.post('/', (req, res, next) => {
  const user = db.get('user').value();
  const { email, password } = req.body;
  if (user.login === email && user.password === password) {
    req.session.isAdmin = true;
    res.redirect('/admin');

  } else {
    res.redirect('/login');
  }

})

module.exports = router
