const express = require('express');
const path = require('path');
const njk = require('nunjucks');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

njk.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

const MajorMinorMiddleware = (req, res, next) => {
  if (req.query.nome) {
    next();
  } else {
    res.redirect('/');
  }
};

const postMiddleware = (req, res, next) => (req.body.idade ? next() : res.redirect('/'));

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', postMiddleware, (req, res) => {
  const idade = moment().diff(moment(req.body.idade, 'DD/MM/YYYY'), 'years');
  return idade > 18 ? res.redirect(`/major?nome=${req.body.nome}`) : res.redirect(`/minor?nome=${req.body.nome}`);
});

app.get('/minor', MajorMinorMiddleware, (req, res) => {
  const { nome } = req.query;
  res.render('minor', { nome });
});

app.get('/major', MajorMinorMiddleware, (req, res) => {
  const { nome } = req.query;
  res.render('major', { nome });
});

app.listen(3000);
