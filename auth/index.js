'use strict';
const { localStrategy,jwtStrategy } = require('./strategies');
const { authRouter } = require('./authRouter');

module.exports = { localStrategy, jwtStrategy, authRouter };