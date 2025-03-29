const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../Models/listings.js");
main()
    .then(() => { console.log("connected to DB") })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/YatraNest');
}
const initDB = async () => {
    try {
        await Listing.insertMany(initData.data);
        console.log("Data was initialized successfully!");
    } catch (err) {
        console.error("Error inserting data:", err);
    }
};
initDB();