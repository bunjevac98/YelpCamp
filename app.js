const express = require('express');
const path = require('path')
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const { nextTick } = require('process');
const Joi = require('joi');
const { runInNewContext } = require('vm');
const { validate } = require('./models/campground');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')


const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

const session = require('express-session');
const { date } = require('joi');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true, 
    useUnifiedtopology: true
    //useFindAndModify: false
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
//ovo je za uprate U ONOM FORMU KOD EDITA AKO SE OVDE ZOVE _METHOD MORA I TAMO TO JE POVESANO
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
//kada postavimo ovo onda u router fajlu treba da stavimo sve to bez zajednicke putanje


app.use(express.static('public'))

const sessionConfig = {
    secret: 'thissougldbebetteeersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }

}
app.use(session(sessionConfig));
app.use(flash());

//kada trazimo url koji ne postoji REDOSLED BITAAN OVO ULAZI SAMO KADA NISTA NIJE NASAO
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

//flash
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));

})


//ovde mozemo imati svakakvu logiku koju mozemo da iskoristimo da vidimo kakav eror imamo
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "IMAMO NEKU GRESKICU"
    }
    res.status(statusCode).render('error', { err });

})

app.listen(3000, () => {
    console.log('Server na portu 3000');
})













