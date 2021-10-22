const config = require('dotenv').config()
const DB_PORT = process.env.PORT || 8080;
const DB_URL = encodeURI(process.env.DB_URL);
const API_KEY = process.env.API_KEY
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session')
const connectEnsureLogin = require('connect-ensure-login');

mongoose.Promise = global.Promise;

const {Users} = require('./models')
const { usersRouter, imagesRouter} = require('./routers');

const app = express();

app.use(session({
  secret: API_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.use(
  [
    morgan('common'),
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json(),
    passport.initialize(),
    passport.session(),
    express.static('public')
  ]
)

passport.use(Users.createStrategy());

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

app.get('/', (req, res) => {
  console.log(__dirname + '/')
  res.sendFile(__dirname + '/index.html');
});

app.get('/register', (req, res) => {
  console.log(__dirname + '/')
  res.sendFile(__dirname + '/register/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/register/index.html');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', successReturnToOrRedirect: '/game'}),  function(req, res) {
  console.log(req.body)
	res.redirect('/game');
});

app.get('/game', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => {
  console.log(__dirname + '/game/index.html')
  res.sendFile(__dirname + '/game/index.html');
});

app.use('/users',   usersRouter);
app.use('/images',   imagesRouter);

let server;
function runServer(dbURI, port) {
  return new Promise((resolve, reject) => {
    mongoose.connect(dbURI, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      }).on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
     })
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DB_URL,DB_PORT).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
