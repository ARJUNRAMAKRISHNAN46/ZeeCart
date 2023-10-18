function errorHandling(err,req,res,next) {
    res.status(500).json({ error: 'An internal server error occurred' });
}