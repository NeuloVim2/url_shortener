const express = require("express"),
  bodyParser = require("body-parser"),
  urlShortener = express.Router(),
  mongoose = require("./db/mongoose"),
  shortenerUrlSchema = require("./db/schemas/shorter_url.schema");

let shortUrlIndexCounter = 1;
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
    UrlShortener.findOne({})
      .sort({ short: "desc" })
      .exec(function (err, doc) {
        if (!err && doc != undefined) {
          shortUrlIndexCounter = doc.short_url + 1;
        }
        if (!err) {
          UrlShortener.findOneAndUpdate(
            { original_url: url },
            { original_url: url, short_url: shortUrlIndexCounter },
            { new: true, upsert: true },
            function (err, doc) {
              if (!err) {
                res.json({
                  original_url: doc.original_url,
                  short_url: doc.short_url,
                });
              }
            }
          );
        }
      });
  } else {
    console.log("url format test is failed");
    res.json({ error: "invalid url" });
  }
});

urlShortener.get("/:short_url", (req, res) => {
  let shortUrlIndex = parseInt(req.params.short_url);
  console.log(shortUrlIndex);
  UrlShortener.findOne({ short_url: shortUrlIndex })
    .then((doc) => {
      console.log(doc.original_url);
      res.redirect(doc.original_url);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = urlShortener;
