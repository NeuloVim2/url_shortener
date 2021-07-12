const mongoose = require('mongoose');

const {Schema} = mongoose;

const shorterUrlSchema = new Schema({
    short_url: { type: String, required: true},
    original_url: { type: String, required: true}
})

module.exports = shorterUrlSchema;