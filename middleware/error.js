module.exports = {
  errorMiddleware : (err, req, res, next) => {
    const statusCode = err.status || 500; // Default to 500 if no status code is set
    res.status(statusCode);
    res.send('page not found');
    console.log('hello');
    res.json({
      error: {
        message: err.message,
        status: statusCode
      }
    });
  },
};