exports.errorHandler = (err, req, res, next) => {
  console.error(`[CRITICAL ERROR] ${req.method} ${req.url}`);
  console.error(`Body:`, req.body);
  console.error(`Error:`, err.message);
  console.error(`Stack:`, err.stack);

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
