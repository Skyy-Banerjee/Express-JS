const express = require('express');
const router = express.Router();
//login or auth.js, naming depends on us
router.post('/', (req, res) => {
    console.log(req.body);
    const { name } = req.body
    if (name) {
        return res.status(200).send(`<h3>Welcome ${name} 🤗</h3>`)
    } else {
        return res.status(401).send(`<h3>Please provide credentials! ☹️</h3>`)
    }

})

module.exports = router;