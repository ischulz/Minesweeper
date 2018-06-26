const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const axios = require('axios');
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get('/getScore', function (req, res) {
    axios.get(`https://api.mlab.com/api/1/databases/minesweeper_scoreboard/collections/scores?apiKey=${process.env.REACT_APP_API_KEY}`)
    .then((response) => {
        res.send(response.data);
    }) 
    .catch(function (error) {
        console.log('Server Error', error);
      });
});

app.post('/storeScore', function (req, res) {
    console.log(req.body);
    axios.post(`https://api.mlab.com/api/1/databases/minesweeper_scoreboard/collections/scores?apiKey=${process.env.REACT_APP_API_KEY}`, {
      name: req.body.name,
      score: req.body.score,
    })
    .then(function (response) {
      res.send();
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);