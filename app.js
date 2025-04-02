const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings =require("./routes/listing.js");
const reviews=require("./routes/review.js");
const session=require("express-session");
main()
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/YatraNest");
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")))

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false, // agar memory store mein change nhi hua ho phir bhi save karta tha band kar diya
    saveUninitialized:true, //=>Agar koi naya session create hota hai lekin usme abhi tak koi data save nahi hua, 
// tab bhi usko store karne ki permission deta hai. 
     cookie:{
       expires:Date.now()+7*24*3600*1000,
       maxAge:7*24*3600*1000,
       httpOnly:true,
     },
}
app.use(session(sessionOptions));
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
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
