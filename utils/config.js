require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.DATABASE;

module.exports = {
  MONGODB_URI,
  PORT,
};
