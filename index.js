const express = require('express');
const app = express();
require('express-async-errors');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./utils/config');

const port = config.PORT || 3003;

// starting the server
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to MongoDB ');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const BlogRoute = require('./routers/blogRoute');
const UserRoute = require('./routers/userRoute');
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
app.use('/api/users', UserRoute);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const listener = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.killServer = () => {
  listener.close();
};

module.exports = app;
