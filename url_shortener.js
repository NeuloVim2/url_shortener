const express            = require('express'),
      bodyParser         = require('body-parser'),
      Utils              = require('./utils'),
      urlShortener       = express.Router(),
      mongoose           = require('mongoose'),
      shortenerUrlSchema = require('./db/schemas/shorter_url.schema');
      
const utils = new Utils();
const urlFormat = /(http[s]?:\/\/)?((www\.)[a-zA-Z]+(\.[a-z]{2,3})$)|((http[s]?:\/\/)?([a-zA-Z]+)(\.[a-z]{2,3})$)/

const UrlShortener = mongoose.model( 'UrlShortener', shortenerUrlSchema );

// Connect body parser
urlShortener.use(bodyParser.urlencoded({ extended: true }));
urlShortener.use(bodyParser.json());

urlShortener.get('/', (req, res) => {
    res.send('in url shortener');
})

urlShortener.post('/new', (req, res) => {
    let url = req.body.url;
    let result = urlFormat.test(req.body.url);
    if ( result ) {
        console.log('url format test is passed');
        let shortUrl = utils.createShortUrl(req.body.url);
        let urlShortener = new UrlShortener({ short_url : shortUrl, original_url: url });

        urlShortener.save((err) => {
            if (err) return console.error(err);
            console.log(`${shortUrl} saved at UrlShortener model`);
        });
        res.json(shortUrl);
    } else {
        console.log('url format test is failed');
        res.json({ error: 'Invalid url format' });
    }
})

urlShortener.get('/:short_url', (req, res) => {
    let shortUrl = req.params.short_url;
    console.log(shortUrl);
    UrlShortener.findOne({shortUrl: shortUrl})
                .then((doc) => {
                    console.log(doc.original_url);
                    res.redirect(doc.original_url);
                })
                .catch((err) => {
                    console.log(err);
                });
})

module.exports = urlShortener;