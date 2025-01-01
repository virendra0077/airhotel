

const express = require("express");
const wrapAsync = require("../utility/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveUrl} = require("../middleware.js");
const {signup, signupP, login, loginP , logout} = require("../controllers/user.js");


router.get("/signup" , wrapAsync (signup))

router.post("/signup" , wrapAsync(signupP))

router.route
router.get("/login" , login)

router.post("/login" , saveUrl,
    passport.authenticate("local" , {failureRedirect: "/login" , failureFlash: true}) ,loginP)

router.get("/logout" , logout);

module.exports = router;