module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}
// wrapAsync helps karta hai agar koi error us taks ko karne mein aata hai toh woh 
//error handling middlware ke pass chala jaye kyunk asunchronous next ko call nhi karte automatically