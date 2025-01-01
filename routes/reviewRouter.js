
const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utility/wrapAsync.js");
const ExpressError = require("../utility/expressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,validateReview , isReviewAuthor } = require("../middleware.js");
const {listingSchema , reviewSchema}= require("../models/joi.js");
const {index, eraseReview, } = require("../controllers/review.js");


//post review
router.post("/", isLoggedIn,
    validateReview  , wrapAsync( index) )


//delete reviews
router.delete("/:reviewId" ,isReviewAuthor , wrapAsync (eraseReview));



module.exports = router;