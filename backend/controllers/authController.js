const authService = require('../services/authService');

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    const user = await authService.signup(email, password);
    
    // Log user activity using Pino (via req.log)
    req.log.info({ userId: user.id, email: user.email }, 'User signed up successfully');
    
    res.status(201).json({ status: 'success', data: user });
  } catch (err) {
    // If the error is our custom "User already exists", send 409 Conflict
    if (err.message === 'User already exists') {
      return res.status(409).json({ status: 'error', message: err.message });
    }
    // Otherwise, pass to global error handler
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    const result = await authService.login(email, password);
    
    req.log.info({ userId: result.user.id }, 'User logged in successfully');
    
    res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    if (err.message === 'Invalid credentials') {
      return res.status(401).json({ status: 'error', message: err.message });
    }
    next(err);
  }
};

module.exports = {
  signup,
  login,
};