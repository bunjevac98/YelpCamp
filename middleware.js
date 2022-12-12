module.exports.isLoggedIn = (req, res, next) => {
    //ovaj user je ustvari napravljen uz pomoc passporta  sa desirializovanim kontentom
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in!!');
        return res.redirect('/login');
    }
    next();
}