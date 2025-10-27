import dotenv from 'dotenv';
dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  corsOrigin: process.env.CORS_ORIGIN,
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
    max: parseInt(process.env.RATE_LIMIT_MAX),
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

export default config;
