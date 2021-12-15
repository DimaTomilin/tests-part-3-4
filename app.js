const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const BlogRoute = require('./routers/blogRoute');
const middleware = require('./utils/middleware');

app.use(cors());
app.use(express.json());

morgan.token('body', function (req) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(' :method :url :status :res[content-length] - :response-time ms :body')
);

app.use('/api/blogs', BlogRoute);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
