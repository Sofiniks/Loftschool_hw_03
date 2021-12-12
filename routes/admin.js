const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../models/db.js');
const formidable = require('formidable');
const { existsSync, mkdirSync, renameSync, unlinkSync } = require('fs');

router.get('/', (req, res, next) => {
  // TODO: Реализовать, подстановку в поля ввода формы 'Счетчики'
  // актуальных значений из сохраненых (по желанию)
  const msgfile = req.flash('info')[0];
  res.render('pages/admin', { title: 'Admin page', msgfile })
})

router.post('/skills', (req, res, next) => {
  const { age, concerts, cities, years } = req.body;
  const arr = [age, concerts, cities, years];
  const skills = db.get('skills').value();
  const newSkills = skills.map((item, index) => {
    const newSkill = arr.filter((_, skillIndex) => skillIndex === index);
    return { ...item, "number": parseInt(newSkill) || item.number, "text": item.text }
  })
  db.set('skills', newSkills).write()
  req.flash('info', 'Навыки обновлены')
  res.redirect('/admin')
})

router.post('/upload', (req, res, next) => {
  const form = new formidable.IncomingForm();
  const upload = path.join(process.cwd(), 'upload');

  if (!existsSync(upload)) {
    mkdirSync(upload)
  }

  form.uploadDir = upload;

  form.parse(req, function (err, fields, files) {
    if (err) {
      if (existsSync(files.photo.filepath)) {
        unlinkSync(files.photo.filepath);
      }
      req.flash('info', 'Ошибка при обработке')
      res.redirect('/admin');
    }
    const { name: title, price } = fields;

    console.log(title, price, files);
    const { originalFilename, filepath } = files.photo;
    const fileName = path.join(upload, originalFilename);
    renameSync(filepath, fileName);
    const index = fileName.lastIndexOf('upload');
    const dir = fileName.slice(index);

    const products = db.get('products').value();
    db.set('products', [...products, { src: dir, name: title, price }]).write();

  })
  req.flash('info', 'Форма обработана')
  res.redirect('/admin');
})

module.exports = router
