import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

// Find user by email
export async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

// Create new user (role defaults to REQUESTER)
export async function createUser(email, password, name, role = 'REQUESTER') {
  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      role,
    },
  });

  return newUser;
}

// Verify password
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Get user without password
export function getUserWithoutPassword(user) {
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
