const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCmapground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds')



//U RENDER IDE PUTANJA OD EJS KOJI RENDERUJEMO
//kao sto je u C# Views
//PAZITI KOD RENDERA NE IDE JEBEN "/" POSLE SVEGA
router.get('/', catchAsync(campgrounds.index))


///ovaj get kada se unesu podaci vraca post metodu a ona se nalazi ispod ovoga
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/', isLoggedIn, validateCmapground, catchAsync(campgrounds.createCampground))

///KOD OVOGA PAZITI JER KAD DODJE DO OVOGA TRAZICE TU TUTU TAKO DA JE REDOSLED GET-A VEOMA BITAN
router.get('/:id', catchAsync(campgrounds.showCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, validateCmapground, catchAsync(campgrounds.upradeCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))



module.exports = router;




