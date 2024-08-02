var express = require('express');
var cors = require('cors');
require('dotenv').config();
var multer = require('multer');
var app = express();
var bodyParser = require('body-parser');
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this line

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), function (req, res, next) { // Corrected endpoint
  const data = {
    "name": req.file.originalname,
    "size": req.file.size,
    "type": req.file.mimetype
  };
  res.json(data); // Send JSON response
  console.log(data);
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
