const urlShortener = require('./url_shortener');

require('dotenv').config();
const express = require('express'),
      cors = require('cors'),
      app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/api/shorturl/', urlShortener);

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port http://localhost:${port}`);
});
