 
 
 if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate")
const ExpressError = require("./utility/expressError.js");
const session = require("express-session");
const mongostore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingsRouter = require("./routes/listingRouter.js");
const reviewsRouter = require("./routes/reviewRouter.js");
const usersRouter = require("./routes/userRouter.js");



const dbURL = process.env.ATLASDB_URL

main()
.then(() => {
console.log("connection build")
})
.catch((err) => {
    console.log(err);

}) 


async function main() {
    await mongoose.connect(dbURL);  
}



app.set("views" , path.join(__dirname ,"views"));
app.set(" view engine" , "ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = mongostore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET_CODE,
    },
    touchAfter: 24 * 3600,
    });

const expressOption = {
    store,
    secret: process.env.SECRET_CODE,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        },
}



store.on("error" , function(e) {
    console.log("Session store error" , e);
})

app.use(session(expressOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demo" , async (req,res) => {
//     let user1 = new User ({
//         email: "abc@xyz.com",
//         username: "abc"

//     })
//    let registerUser = await User.register(user1,"mypassword1" );
//    res.send(registerUser);
// })




app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter );


app.get("/" , (req, res) => {
    res.send("hello , I am root")
});
app.use("*" , (req,res,next) => {
    next(new ExpressError(404,"Error 404 Page Not Found!"));
})

app.use((err,req,res,next) => {
    let {statusCode=500 , message="Something went wrong!"} = err;
    res.status(statusCode).render("listing/error.ejs", {err});

})


app.listen(8000, () => {
    console.log("app is running at port 8000");
});