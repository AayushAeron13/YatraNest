const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../Models/listings.js");
main()
    .then(() => { console.log("connected to DB") })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/YatraNest');
}
getRandomOwner = function () {
    let owners = ["67ee6a0d94e18cf170669dd7", "67efcca00b8a27ce4ad9077f", "67ee8cec40e20d150f2515d6", "67efd19ef2a9a392ddcba8cf"];
    return owners[Math.floor(Math.random() * (4))];
}
const initDB = async () => {
    try {
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj) => ({ ...obj, owner: getRandomOwner() }));
        await Listing.insertMany(initData.data);
        console.log("Data was initialized successfully!");
    } catch (err) {
        console.error("Error inserting data:", err);
    }
};
initDB();