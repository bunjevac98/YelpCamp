const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { route } = require('./campgrounds');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');



router.get('/register', (req, res) => {
    res.render('users/register');
})


router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            } else {
                req.flash('success', 'Welcome to YelpCamp');
                res.redirect('/campgrounds');
            }
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }

}))


router.get('/login', (req, res) => {
    res.render('users/login');
})


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', failureMessage: 'Morate ponovo niste se ulogovali' }), (req, res) => {
    req.flash('success', 'Welcome back');
    //console.log("OVOOOOOOOOOOOOOOOOOOOOOOOO ", req.session.returnTo)
    const redirectUrl = req.session.vratiSe || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

//ima greska mozda
//logout je sada funkcija koja je asinhrona proveriti ovo sta se desava jer je jako komplikovano
router.get('/logout', catchAsync(async (req, res, next) => {
    try {
        const logaut = await req.logout(req.user, function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/campgrounds');
        });
        req.flash('success', "RADIIIIIIIIIIIII");
    } catch (e) {
        console.log(e);
        req.flash('error', "Nesto ste pogresili");
        res.redirect('/campgrounds');
    }
}))

module.exports = router;
