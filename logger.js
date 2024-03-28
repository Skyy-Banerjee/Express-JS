//Middleware 73

// req => middleware => res
const logger = (req, res, next) => {
    const { method, url } = req;
    const time = new Date().getFullYear();
    console.log(method, url, time);
    //res.send(`Testing`); //<== either this
    next(); //!imp.. <== Or this
}


module.exports = logger;