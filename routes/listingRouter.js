const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utility/wrapAsync.js");
const {index , create, newListing, singleListing, editListing, edit, erase} = require("../controllers/listings.js");
const{storage} = require("../cloudConfig.js");



const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const multer  = require('multer')
const upload = multer({ storage })


// all list of listing
router.get("/" , wrapAsync( index));

//singleing listing details
router.get("/:id"  ,wrapAsync( singleListing));




// create new listing validateListing ,
router.post("/new",isLoggedIn  ,upload.single('image'),validateListing,
wrapAsync( newListing));
//  router.post("/new" , upload.single('image') , (req,res) => {
//     res.send(req.file);
//  });
//edit

router.put("/edited/:id" ,isLoggedIn,isOwner   ,upload.single('image'),

validateListing, wrapAsync(editListing))

router.get("/edit/:id" , isLoggedIn, isOwner ,wrapAsync( edit))
//delete
router.delete("/delete/:id" , isLoggedIn,isOwner  , wrapAsync(erase));



router.get("/create/new" , isLoggedIn ,create)
module.exports = router;