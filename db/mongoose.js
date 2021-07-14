const mongoose = require('mongoose');
const uri = 'mongodb+srv://user1:sfIfe231CK@cluster0.bghm0.mongodb.net/url_shortener?retryWrites=true&w=majority';

// Connect mongoose to MongoDB database
mongoose.connect(uri ,{ useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'cnnection error:'));
db.once('open', () => {
  console.log('connection to db - successful');
})

module.exports = db;