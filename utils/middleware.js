const jwt = require('jsonwebtoken');
require('dotenv').config();

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const authToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (authHeader.split(' ')[1] === null || !authHeader)
    return res.status(401).send({ error: 'Access Token Required' });

  const accessToken = authHeader.split(' ')[1];

  jwt.verify(accessToken, process.env.SECRET, (err, user) => {
    if (err) {
      next(err);
    }
    req.user = user;
    next();
  });
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  authToken,
};
