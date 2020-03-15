//for using express js framework
const express = require('express');
const app = express();

//path and router for connection port
const path = require('path');
const router = express.Router();

//request used for api
const request = require('request');

//for providing connection
var cors = require('cors');

//used for mysql
var mysql = require('mysql');

//for incoming request body
var bodyParser = require('body-parser');
app.use(bodyParser());
app.use(cors());

//for database connection to mysql
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dhanasekar',
  database: 'new_schema'
});

connection.connect(function(error) {
  if (error) console.log(error);
  else console.log('connected');
});

//for using html
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

//for request the api using request method
app.get('/getMovieDetails', function(req, res) {
  var id = req.query.Movieid;

  //using split to get the movieid
  var url = id.split('/');
  var movieid = url[url.length - 2];

  //passing movie id to the api
  request(
    ' http://www.omdbapi.com/?i=' + movieid + '&apikey=9a122002',

    { json: true },
    (err, response, body) => {
      if (err) {
        return console.log(err);
      }
      //creating a json var
      var details = {
        url: id,
        title: body.Title,
        plot: body.Plot,
        director: body.Director,
        writer: body.Writer,
        stars: body.Actors,
        ratings: body.Ratings
      };

      //sql query to insert into table name
      connection.query(
        'INSERT INTO api_data(url,title, plot, director, writer, stars, rating ) VALUES("' +
          id +
          '","' +
          body.Title +
          '","' +
          body.Plot +
          '","' +
          body.Director +
          '","' +
          body.Writer +
          '","' +
          body.Actors +
          '","' +
          body.Ratings +
          '")',
        function(err, result, fields) {
          if (err) console.log(err);

          //sending the response to the html page
          res.json(details);
        }
      );
    }
  );
});

//add the router
app.use('/', router);
app.listen(process.env.port || 2020);
console.log('Running at Port 2020');
