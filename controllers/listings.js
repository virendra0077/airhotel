

const { query } = require("express");
let Listing = require("../models/listing.js");
const { link } = require("joi");
const { stackTraceLimit } = require("../utility/expressError.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index = async(req,res) => {

    const lists = await Listing.find({});
    res.render("listing/listingall.ejs" ,{ lists}   ); 

}

module.exports.create =  (req, res) => {
 
    res.render("listing/create.ejs")
}


module.exports.newListing = async (req,res,next) => {
let response = await geocodingClient.forwardGeocode({
    query: req.body
    .location,
    limit: 1})
    .send();
   

    let url = req.file.path;
    let filename = req.file.filename;
    const newlist = new Listing(req.body);
    newlist.owner = req.user._id;
    newlist.image.url = url;
    newlist.image.filename = filename;
    newlist.geometry = response.body.features[0].geometry;
    let savedListing = await newlist.save();
    // console.log(savedListing);
   req.flash("success", "New Listing Created Successfully!")
   res.redirect("/listings")
}

module.exports.singleListing = async (req,res) => {
    let {id} = req.params;
    let list  = await Listing.findById(id).populate({path:"reviews", populate :{ path:"author"}}).populate("owner");
    if(!list) {
        req.flash("error" , "Listing you requested for does not exist!");
      return  res.redirect("/listings");
    }   
    res.render("listing/singlelist.ejs" , {list , mapToken: process.env.MAP_TOKEN});

}

module.exports.editListing =  async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file  !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image= {url , filename};
        await listing.save();
    }
   
    
     req.flash("success", "Listing Edited Successfully!");
     res.redirect("/listings");
};

module.exports.edit = async  (req,res) => {
    let {id} = req.params;
    let list  = await Listing.findById(id);
    res.render("listing/edit.ejs", {list})
}

module.exports.erase = async (req,res) => {
    let {id} = req.params;
    let newlist = req.body;
    
     await Listing.findByIdAndDelete(id);
     
     req.flash("success", "Listing Deleted Successfully!")
     res.redirect("/listings");
}