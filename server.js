const config = require('dotenv').config()
const PORT = process.env.PORT || 8080;
const MLAB_URI = process.env.MLAB_URI;
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const {corsMiddle} = require('./middleware')
mongoose.Promise = global.Promise;

const {localStrategy, jwtStrategy } = require('./authentication');

passport.use(localStrategy);
passport.use(jwtStrategy);

const app = express();

app.use([morgan('common'),bodyParser.urlencoded({ extended: false }),bodyParser.json(),express.static('public')],corsMiddle)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const jwtAuth = passport.authenticate('jwt', { session: false });

app.use('/login',        signinRouter);
app.use('/users',          usersRouter);

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
  runServer(MLAB_URI,PORT).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
