

const User = require("../models/user.js");



module.exports.signup = async (req,res) => {
    res.render("user/signup.ejs")
    };

module.exports.signupP = async (req,res) =>{
try{
    let {username, email , password} = req.body;
    const newUser = new User({username, email})
   
    const registerUser = await User.register(newUser , password);
    console.log(registerUser);             
    req.login(registerUser, (err) => {
        if(err) {
            return next(err);
        }
        req.flash("success" , "Welcome to Airhotel!");
        res.redirect("/listings");
    })                                     
    
} catch(e) {
    req.flash("error" , e.message);
    res.redirect("/signup");
}
};

module.exports.login =  (req,res) => {
    res.render("user/login.ejs")
};


module.exports.loginP = async (req,res) => {
    req.flash("success" , "Welcome to Airhotel")
    let redirect = res.locals.redirectUrl || "/listings";
res.redirect(redirect);
}


module.exports.logout =(req,res) => {
    req.logout((err) => {
        if(err) {
          return  next(err)
        } 
        req.flash("success" , "logged out Successfully");
        res.redirect("/listings")
    })
}