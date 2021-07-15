const mongoose = require('mongoose');

const {Schema} = mongoose;

const shorterUrlSchema = new Schema({
    original_url: { type: String, required: true},
    short_url: Number
})

// initiating a model
let UrlShortener = mongoose.model("UrlShortener",shorterUrlSchema);

module.exports = UrlShortener;