// Error type mappings
const ERROR_MAPPINGS = {
  JsonWebTokenError: {
    message: 'Invalid authentication token',
    statusCode: 401,
  },
  TokenExpiredError: {
    message: 'Authentication token has expired',
    statusCode: 401,
  },
  NotBeforeError: {
    message: 'Authentication token not active',
    statusCode: 401,
  },
  429: {
    message: 'Too many requests, please try again later',
    statusCode: 429,
  },
  ECONNREFUSED: {
    message: 'Service temporarily unavailable',
    statusCode: 503,
  },
  ETIMEDOUT: {
    message: 'Request timeout',
    statusCode: 408,
  },
};

export function errorHandler(err, req, res, next) {
  console.error('🚨 Error occurred:', {
    message: err.message,
    name: err.name,
    code: err.code,
    statusCode: err.statusCode,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });

  // Get error mapping or use defaults
  const errorMapping = ERROR_MAPPINGS[err.name] || ERROR_MAPPINGS[err.code];
  const statusCode = errorMapping?.statusCode || err.statusCode || 500;
  const message =
    errorMapping?.message || err.message || 'Internal server error';

  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(isDevelopment && {
      stack: err.stack,
      details: {
        name: err.name,
        code: err.code,
        originalMessage: err.message,
      },
    }),
    ...(statusCode === 500 &&
      !isDevelopment && {
        error: 'Something went wrong on our end',
      }),
  });
}

export function notFound(req, res, next) {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}
