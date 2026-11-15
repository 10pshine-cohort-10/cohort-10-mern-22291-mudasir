const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const signup = async (email, password) => {
  // 1. Check if user already exists
  const existingUser = await userModel.findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // 2. Hash the password (10 salt rounds)
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // 3. Save to database
  const userId = await userModel.createUser(email, passwordHash);
  
  return { id: userId, email };
};

const login = async (email, password) => {
  // 1. Find user
  const user = await userModel.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // 2. Compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // 3. Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { token, user: { id: user.id, email: user.email } };
};

module.exports = {
  signup,
  login,
};