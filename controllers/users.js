const User = require('../models/user');



module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}


module.exports.register = async (req, res, next) => {
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

}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back');
    //console.log("OVOOOOOOOOOOOOOOOOOOOOOOOO ", req.session.returnTo)
    const redirectUrl = req.session.vratiSe || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = async (req, res, next) => {
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
}

