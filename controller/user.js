const User = require('../models/user');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const { encryption } = require('../utils/bcrypt');
const { passwordValidation } = require('../utils/validation');
const { generateAccessToken } = require('../utils/generateToken');

const createNewUser = async (req, res) => {
  const { username, name, password } = req.body;

  if (await User.exists({ username })) {
    return res.status(409).send({ error: 'User already exists' });
  }

  passwordValidation(password, res);
  const passwordHash = await encryption(password);
  const newUser = new User({ username, name, passwordHash });
  await newUser.save();

  res.status(201).send('Register Success');
};

const getAllUsers = async (req, res) => {
  const users = await User.find().populate('blogs', {
    title: 1,
    url: 1,
    author: 1,
  });
  res.send(users);
};

const logIn = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.find({ username });
  if (user) {
    const correctPassword = await bcrypt.compare(
      `${password}`,
      `${user.password}`
    );
    if (correctPassword) {
      const accessToken = generateAccessToken({
        username,
        id: user._id.toString(),
      });

      res.send({
        token: accessToken,
        username,
        name: user.name,
      });
    } else
      return res.status(403).send({ error: 'User or Password is incorrect' });
  } else return res.status(404).send({ error: 'Cannot find user' });
};

module.exports = { createNewUser, getAllUsers, signIn: logIn };
