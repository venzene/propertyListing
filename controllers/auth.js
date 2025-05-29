const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = 'secret';

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: null,
    oldInput: { email: '', password: '' },
    validationErrors: [],
    isAuthenticated: req.isAuthenticated || false, 
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: null,
    oldInput: { email: '', password: '', confirmPassword: '' },
    validationErrors: [],
    isAuthenticated: req.isAuthenticated || false, 
  });
};

// SIGNUP Controller
exports.signup = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).render('auth/register', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: 'Passwords do not match',
      oldInput: { email, password, confirmPassword },
      validationErrors: [],
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).render('auth/register', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: 'User already exists!',
        oldInput: { email, password, confirmPassword },
        validationErrors: [],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      favorite: { items: [] }
    });

    await newUser.save();

    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.status(500).render('auth/register', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: 'Something went wrong. Please try again.',
      oldInput: { email, password, confirmPassword },
      validationErrors: []
    });
  }
};


// LOGIN Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Invalid email or password',
        oldInput: { email, password },
        validationErrors: [],
        isAuthenticated: false
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Invalid email or password',
        oldInput: { email, password },
        validationErrors: [],
        isAuthenticated: false
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.redirect('/browse/'); // Redirect to the browse page after successful login
  } catch (err) {
    console.error(err);
    res.status(500).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: 'Something went wrong. Please try again.',
      oldInput: { email, password },
      validationErrors: [],
      isAuthenticated: false
    });
  }
};

// LOGOUT Controller
exports.logout = (req, res) => {
  res.clearCookie('token'); 
  req.isAuthenticated = false;
  res.locals.isAuthenticated = false;
  res.redirect('/');
};
