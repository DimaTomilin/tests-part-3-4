const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateAccessToken = (user) => {
  return jwt.sign(user, process.env.SECRET, { expiresIn: '1h' });
};

//Refresh Token
