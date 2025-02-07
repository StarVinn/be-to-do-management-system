var express = require('express');
var router = express.Router();

// Greeting API
router.get('/', function (req, res) {
  res.send('Selamat Datang\nDi Restful API Pemrograman Web Guru Tamu');
});

module.exports = router;
