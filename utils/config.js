require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE
    : process.env.DATABASE;

module.exports = {
  MONGODB_URI,
  PORT,
};
