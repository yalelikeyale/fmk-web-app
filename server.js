const config = require('dotenv').config()
const DB_PORT = process.env.PORT || 8080;
const DB_URL = encodeURI(process.env.DB_URL);
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const morgan = require('morgan');
const {corsMiddle} = require('./middleware')
mongoose.Promise = global.Promise;


const {localStrategy, jwtStrategy } = require('./auth');
passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', {session: false});

const { signinRouter, usersRouter } = require('./routers');

const app = express();

app.use([morgan('common'),bodyParser.urlencoded({ extended: false }),bodyParser.json(),express.static('public')],corsMiddle)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/game', jwtAuth, (req, res) =>{
  res.sendFile(__dirname + './app/index.html');
})

app.use('/login',  signinRouter);
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
