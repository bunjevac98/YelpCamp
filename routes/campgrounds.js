const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCmapground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds')
//storage za cloudinary
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage })

//U RENDER IDE PUTANJA OD EJS KOJI RENDERUJEMO
//kao sto je u C# Views
//PAZITI KOD RENDERA NE IDE JEBEN "/" POSLE SVEGA
//MOZDA TREBA IS AUTHOR JER UPLOAD SLIKE RADI KADA UPDEJTUJEM
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image', 10), validateCmapground, catchAsync(campgrounds.createCampground));
/*.post(upload.array('image'), (req, res) => {
    console.log(req.files)
    console.log("BODYYYYYYYYY")
    console.log(req.body)
    res.send("RADIIIIIIIIIIIIIIIII")
})
*/
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCmapground, catchAsync(campgrounds.upradeCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));




///ovaj get kada se unesu podaci vraca post metodu a ona se nalazi ispod ovoga

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))



module.exports = router;




