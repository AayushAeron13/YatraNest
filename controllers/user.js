const User = require("../Models/user.js");
 //get request for signup
 module.exports.signupPage = (req, res) => {
     res.render("users/signup.ejs");
 };
 
 //post request for signup
 module.exports.signup = async (req, res) => {
     try {
         let { username, email, password } = req.body;
         const newUser = new User({ email, username });
         const registeredUser = await User.register(newUser, password);
         req.login(registeredUser, (err) => {
             if (err) {
                 return next(err);}
             req.flash("success", "Welcome to YatraNest");
             res.redirect("/listings");
         });
     }
     catch (err) {
         req.flash("error", err.message);
         res.redirect("/signup");
     }
 };
 
 //get request for login page
 module.exports.loginPage = (req, res) => {
    res.render("users/login.ejs");
};
 
 //post request for login page
 module.exports.login = async (req, res) => {
    req.flash("success", `Welcome back ${req.body.username}`);
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
 
 //logout route
 module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err)
            return next(err);
        else {
            req.flash("success", "Successfully logged out , See you Again Soon!");
            res.redirect("/listings");
        }
    });
}