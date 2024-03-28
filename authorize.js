//74.multiple middlewares

const authorize = (req, res, next) => {
    const { user } = req.query;
    if (user === 'john') {
        req.user = { name: 'John', id: 4 };
        next();
    } else {
        res.status(401).send('<h2>Unauthorized!</h2>');
    }
    // console.log('authorize');
    // next();
}

module.exports = authorize;