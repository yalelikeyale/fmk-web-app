const config = require('dotenv').config()
const DB_PORT = process.env.PORT || 8080;
const DB_URL = encodeURI(process.env.DB_URL);
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session')
const connectEnsureLogin = require('connect-ensure-login');

mongoose.Promise = global.Promise;
const JWT_SECRET = process.env.JWT_SECRET

const { usersRouter } = require('./users');
const { User } = require('./models')

const app = express();

app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
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

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.post('/login', passport.authenticate('local', { failureRedirect: '/' }),  function(req, res) {
	console.log(req.user)
	res.redirect('/game');
});

app.get('/game', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  console.log(__dirname + '/game/launch.html')
  res.sendFile(__dirname + '/game/launch.html');
});

app.use('/users',   usersRouter);

let server;
function runServer(dbURI, port) {
  return new Promise((resolve, reject) => {
    mongoose.connect(dbURI, err => {
      if (err) {
        console.log(err);
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
