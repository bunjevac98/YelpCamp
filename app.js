const express = require('express');
const path = require('path')
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync');
const Campground = require('./models/campground');
const { nextTick } = require('process');
const Joi = require('joi');
const { runInNewContext } = require('vm');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedtopology: true
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
//OVDEEEEEEEEEEEEEEEEE
app.use(express.urlencoded({ extended: true }))

//ovo je za uprate U ONOM FORMU KOD EDITA AKO SE OVDE ZOVE _METHOD MORA I TAMO TO JE POVESANO
app.use(methodOverride('_method'));

const validateCmapground = (req, res, next) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required()
        }).required()
    })
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}







app.get('/', (req, res) => {
    res.render('home');

})
//U RENDER IDE PUTANJA OD EJS KOJI RENDERUJEMO
//kao sto je u C# Views
//PAZITI KOD RENDERA NE IDE JEBEN "/" POSLE SVEGA
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})


///ovaj get kada se unesu podaci vraca post metodu a ona se nalazi ispod ovoga
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', validateCmapground, catchAsync(async (req, res, next) => {
    //BODY JE PRAZAN I MI MORAMO DA GA PARSIRAMO TAKO DA TREBA DA 
    //DEKODIRAMO ONO STO SMO NAPISALI A TO SE NALAZI OVDEEEEEEEEEEEE
    //u ovom body se nalazi nas objekat
    /*
    if (!req.body.campground) {
        throw new ExpressError('Invalid Campground Data', 400);
    }*/

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

///KOD OVOGA PAZITI JER KAD DODJE DO OVOGA TRAZICE TU TUTU TAKO DA JE REDOSLED GET-A VEOMA BITAN
app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {

    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

//kada trazimo url koji ne postoji REDOSLED BITAAN OVO ULAZI SAMO KADA NISTA NIJE NASAO
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













