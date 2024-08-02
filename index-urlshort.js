require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const validUrl = require('valid-url');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlDatabase = [];
let idCounter = 1;


app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  if (!validUrl.isWebUri(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = idCounter++;
  urlDatabase.push({ originalUrl, shortUrl });

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = parseInt(req.params.shortUrl);
  const urlEntry = urlDatabase.find(entry => entry.shortUrl === shortUrl);

  if (urlEntry) {
    res.redirect(urlEntry.originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

 
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
