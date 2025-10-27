import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import {
  createUser,
  findUserByEmail,
  verifyPassword,
  getUserWithoutPassword,
} from '../models/userModel.js';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );
}

export async function signup(req, res) {
  const { email, password, name, role } = req.body;

  console.log('User signup attempt:', { email, name, role });

  const normalizedRole = role === 'VALIDATOR' ? 'VALIDATOR' : 'REQUESTER';
  const user = await createUser(email, password, name, normalizedRole);

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: getUserWithoutPassword(user),
  });
}

export async function signin(req, res) {
  const { email, password } = req.body;

  console.log('User signin attempt:', { email });

  const user = await findUserByEmail(email);
  if (!user) {
    console.log('Signin failed - user not found:', { email, ip: req.ip });
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
    });
  }

  const match = await verifyPassword(password, user.password);
  if (!match) {
    console.log('Signin failed - invalid password:', { email, ip: req.ip });
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
    });
  }

  // Generate token
  const token = generateToken(user);

  console.log('User signed in successfully:', {
    email,
    userId: user.id,
  });

  res.json({
    success: true,
    token,
    user: getUserWithoutPassword(user),
  });
}

export async function getMe(req, res) {
  const user = await findUserByEmail(req.user.email);
  if (!user) {
    console.log('User not found for getMe:', { email: req.user.email });
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  console.log('User info retrieved:', { email: user.email });

  res.json({
    success: true,
    user: getUserWithoutPassword(user),
  });
}

export async function signout(req, res) {
  console.log('User signed out:', { email: req.user?.email });

  res.json({
    success: true,
    message: 'Signed out successfully',
  });
}
