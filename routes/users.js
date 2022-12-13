const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { route } = require('./campgrounds');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');


router.get('/register', users.renderRegister)


router.post('/register', catchAsync(users.register))


router.get('/login', (req, res) => {
    res.render('users/login');
})


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', failureMessage: 'Morate ponovo niste se ulogovali' }), users.login)

//ima greska mozda
//logout je sada funkcija koja je asinhrona proveriti ovo sta se desava jer je jako komplikovano
router.get('/logout', catchAsync(users.logout))

module.exports = router;
