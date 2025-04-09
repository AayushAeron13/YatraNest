if(process.env.NODE_ENV!="production"){
    require(("dotenv")).config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user.js");
const DB_URL = process.env.ATLASDB_URL;
main()
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(DB_URL);
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")))
const store = MongoStore.create({
    mongoUrl:DB_URL,
    crypto:{
        secret:"mysupersecretcode"
    },
    touchAfter: 24*3600
});

store.on("error",()=>{
    console.error("Error in mongo session store",err);
})
const sessionOptions = {
    store,
    secret: "mysupersecretcode",
    resave: false, // agar memory store mein change nhi hua ho phir bhi save karta tha band kar diya
    saveUninitialized: true, //=>Agar koi naya session create hota hai lekin usme abhi tak koi data save nahi hua, 
    // tab bhi usko store karne ki permission deta hai. 
    cookie: {
        expires: Date.now() + 7 * 24 * 3600 * 1000,
        maxAge: 7 * 24 * 3600 * 1000,
        httpOnly: true,// cross site scripting attacks
    },
}
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // A web application needs the ability to know that the same user is browsing from page to page
passport.use(new LocalStrategy(User.authenticate())); // yeh kehta jo hamne dalehai jaise ki email woh bhi use karna default ke alawa i.e. username and password
passport.serializeUser(User.serializeUser()); // when we store user information in a session
passport.deserializeUser(User.deserializeUser()); // when we remove user information in a session

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;// passport stores user information in req.user we can access if it is undefined then there is no user
    next();
});
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { message });
})
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
