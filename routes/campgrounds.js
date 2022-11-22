const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');


const validateCmapground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

//U RENDER IDE PUTANJA OD EJS KOJI RENDERUJEMO
//kao sto je u C# Views
//PAZITI KOD RENDERA NE IDE JEBEN "/" POSLE SVEGA
router.get('/', async (req, res) => {
    console.log('IMAMO GRESKUUUUUUUUUUUUUUUUU')
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})


///ovaj get kada se unesu podaci vraca post metodu a ona se nalazi ispod ovoga
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateCmapground, catchAsync(async (req, res, next) => {
    // //#region region 

    //BODY JE PRAZAN I MI MORAMO DA GA PARSIRAMO TAKO DA TREBA DA 
    //DEKODIRAMO ONO STO SMO NAPISALI A TO SE NALAZI OVDEEEEEEEEEEEE
    //u ovom body se nalazi nas objekat

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

///KOD OVOGA PAZITI JER KAD DODJE DO OVOGA TRAZICE TU TUTU TAKO DA JE REDOSLED GET-A VEOMA BITAN
router.get('/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    console.log(campground);
    res.render('campgrounds/show', { campground });
}))

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', validateCmapground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))



module.exports = router;




