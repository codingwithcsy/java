const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send('Invalid email or password');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).send('Invalid email or password');

    const payload = { userId: user._id, isAdmin: user.isAdmin };
    const token = jwt.sign(payload, secret);
    res.send({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
