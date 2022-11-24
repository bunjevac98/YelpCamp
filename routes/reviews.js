const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { reviewSchema } = require('../schemas.js');
const Review = require('../models/review')
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfuly made a new review!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    //sada brisemo iz campgrounda taj jedan review
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfuly deleted review!');
    res.redirect(`/campgrounds/${id}`);

}))




module.exports = router;







