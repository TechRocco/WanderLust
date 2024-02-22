const User = require("../models/user.js");



module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);        // as we have to save data so we use passport-local-mongoose
        req.logIn(registeredUser, (err) => {
            if(err){
             return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.login =  async(req, res)=>{
    req.flash("success", "Welcome back to WanderLust!")
    let redirectedUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectedUrl);
};

module.exports.logout =  (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are Logged Out!");
        res.redirect("/listings");
    })
};

