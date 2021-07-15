const express = require("express"),
  bodyParser = require("body-parser"),
  urlShortener = express.Router(),
  mongoose = require("./db/mongoose"),
  shortenerUrlSchema = require("./db/schemas/shorter_url.schema");

// const urlFormat = /(http[s]?:\/\/)?((www\.)[a-zA-Z]+(\.[a-z]{2,3}\/?)$)|((http[s]?:\/\/)?([a-zA-Z]+)(\.[a-z]{2,3}\/?)$)|((http[s]?:\/\/)?(www\.)?([a-zA-Z]+)(\.[a-z]{2,3}\/?)(\/[a-z]+\/?)+$)/
const urlFormat = /http[s]?:\/\/www\.[a-zA-Z]+\.[a-z]{3}$/;

const UrlShortener = mongoose.model("UrlShortener", shortenerUrlSchema);

// Connect body parser
urlShortener.use(bodyParser.urlencoded({ extended: true }));
urlShortener.use(bodyParser.json());

urlShortener.get("/", (req, res) => {
  res.send("in url shortener");
});

urlShortener.post("/", (req, res) => {
  let url = req.body.url;
  let result = urlFormat.test(req.body.url);
  console.log(url);
  if (result) {
    console.log("url format test is passed");
    UrlShortener.exists({ original_url: url }, (err, result) => {
      console.log(result);
      if (!err && result) {
        UrlShortener.findOne({ original_url: url })
          .then((doc) => {
            console.log(`return existing object`);
            res.json({
              original_url: doc.original_url,
              short_url: doc.short_url,
            });
          })
          .catch((err) => {
            console.error(`can't return existing document, got error ${err}`);
          });
      } else {
        console.log(`creating new documnet`)
        UrlShortener.create({ original_url: url, short_url: add() }, function (err, doc) {
          if (err) {
           return console.log(`failed to create document, returned such error ${err}`);
          }
          console.log(`documnet ${doc} created succefully`);
          UrlShortener.findOne({ original_url: url }, (err, doc) => {
            if(err) return console.error(`unable to find document. ${err}`)
            res.json({original_url: doc.original_url, short_url: doc.short_url})
          })
        });
      }
    });
  } else {
    console.log("url format test is failed");
    res.json({ error: "invalid url" });
  }
});

urlShortener.get("/:short_url", (req, res) => {
  let shortUrlIndex = req.params.short_url;
  console.log(shortUrlIndex);
  UrlShortener.findOne({ short_url: shortUrlIndex }).then((err, doc) => {
    if (!err) {
      console.log(doc.original_url);
      res.redirect(doc.original_url);
    }
  });
});


const add = (function () {
  let counter = 0;
  return function () {counter += 1; return counter}
})()

module.exports = urlShortener;
