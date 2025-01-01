
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: "pk.eyJ1IjoidmlyZW5kcmEyNiIsImEiOiJjbTU2YWgzdzYzNjJpMnJzZWN5NXVqNW9zIn0.s5wPVcMJaly36AaPtEYVZg" });


main()
.then(() => {
console.log("connection build")
})
.catch((err) => {
    console.log(err);

}) 


async function main() {

    await mongoose.connect('mongodb://127.0.0.1:27017/airhotel');  
};
// async (req,res,next) => {
//     let response = await geocodingClient.forwardGeocode({
//         query: req.body
//         .location,
//         limit: 1})
//         .send();
       
    
//         let url = req.file.path;
//         let filename = req.file.filename;
//         const newlist = new Listing(req.body);
//         newlist.owner = req.user._id;
//         newlist.image.url = url;
//         newlist.image.filename = filename;
//         newlist.geometry = response.body.features[0].geometry;
//         let savedListing = await newlist.save();
//         console.log(savedListing);
 let datasaved = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '6762f3d34f92cee355f5deaa' }));

    for (let obj of initData.data) {
        let response = await geocodingClient.forwardGeocode({
            query: obj.location,
            limit: 1
        }).send();

        obj.geometry = response.body.features[0].geometry;
    }

    await Listing.insertMany(initData.data);
    console.log("data saved");
};

main().then(datasaved).catch(err => console.error(err));