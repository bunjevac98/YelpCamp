const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { route } = require('./campgrounds');



router.get('/register', (req, res) => {
    res.render('users/register');
})


module.exports = router;
