const User = require('../models/user');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const { encryption } = require('../utils/bcrypt');
// const { generateAccessToken } = require('../utils/generateToken');

const createNewUser = async (req, res) => {
  const { username, name, password } = req.body;
  if (await User.findOne({ username })) {
    return res.status(409).send('User already exists');
  }
  const passwordHash = await encryption(password);
  const newUser = new User({ username, name, passwordHash });
  await newUser.save();
  res.status(201).send('Register Success');
};

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.send(users);
};

module.exports = { createNewUser, getAllUsers };