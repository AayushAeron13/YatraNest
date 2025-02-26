const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./Models/listings"); 
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
main()
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/YatraNest");
}
app.engine("ejs",ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")))

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});
// index route
app.get("/listings", async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings }); 
    
});

// new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
// show route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});
// create 
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save(); 
    res.redirect("/listings"); 

});
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});
app.put("/listings/:id",async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect(`/listings/${id}`);
});
// delete
app.delete("/listings/:id",async(req,res)=>{    
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
