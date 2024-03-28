const express = require('express');
const app = express();
const port = 5000;

const peopleRouter = require('./routes/people');
const loginRouter = require('./routes/login');

// static assets
app.use(express.static('./methods-public'))
//parse form-data
app.use(express.urlencoded({ extended: false }))
//parse json
app.use(express.json());

app.use('/api/people', peopleRouter);
app.use('/login', loginRouter);

app.listen(port, () => {
    console.log(`App listening on port: ${port}...`);
})
