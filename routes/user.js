const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
// const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");




router.route("/signup")
//render signupForm
.get(userController.signupForm )
 //signup new users
.post(asyncWrap(userController.signUp));




router.route("/login")
//render loginForm
.get(userController.loginForm)
//login Existing Users
.post(saveRedirectUrl, 
//as we only have to authenticate so we use passport.authenticate middleware
passport.authenticate("local", {         //local for local strategy
    failureRedirect: "/login",           //on wrong input or authentication failure redirect to login page
    failureFlash: true }),               //flash messsage on authentication faliure
    
    userController.login);



    
//to logout the current login session
router.get("/logout", userController.logout);

module.exports = router;