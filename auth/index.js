'use strict';
const { localStrategy,jwtStrategy, authRouter } = require('./strategies');

module.exports = { localStrategy, jwtStrategy, authRouter };