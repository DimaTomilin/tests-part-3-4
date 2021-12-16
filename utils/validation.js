const passwordValidation = (password, res) => {
  if (password.length < 3 || !password) {
    res.status(400).send('Invalid password');
  }
};

module.exports = { passwordValidation };
