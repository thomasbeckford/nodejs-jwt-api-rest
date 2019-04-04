const express = require('express'); // Libreria nodejs
const logger = require('morgan'); // Logger
const movies = require('./routes/movies');
const users = require('./routes/users');
const bodyParser = require('body-parser');
const mongoose = require('./config/database'); //database configuration
var jwt = require('jsonwebtoken');
const app = express();
app.set('secretKey', 'oirotaelayos'); // jwt secret token
// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(logger('dev')); // Logger
app.use(bodyParser.urlencoded({extended: false}));
app.get('/', function(req, res){
res.json({"frontend" : "Listening...", "Register": "/users/register", Authenticate: "/users/authenticate", GetMovies: "/movies", AddMovie: "post /movies", UpdateMovie: "put /movies/id", DeleteMovie: "delete /movies/id" });
});

// EJEMPLOS CURL
//REGISTER: curl -X POST "http://localhost:3000/users/register" -H "Content-Type: application/x-www-form-urlencoded" -d "{\"email\": \"test@test.com\", \"password\": \"123456\"}"
//AUTHENTICATE: curl -X POST "http://localhost:3000/users/authenticate" -H "Content-Type: application/x-www-form-urlencoded" -d "{\"email\": \"test@test.com\", \"password\": \"123456\"}"


// public route
app.use('/users', users);
// private route
app.use('/movies', validateUser, movies);

function validateUser(req, res, next) { //Verify if x-access-token exists and its valid.
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
    if (err) {
      res.json({status:"error", message: err.message, data:null});
    }else{
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
  
}

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req, res, next) {
 let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// handle errors
app.use(function(err, req, res, next) {
 console.log(err);
 
  if(err.status === 404)
   res.status(404).json({message: "Not found"});
  else if(err.status === 409)
    res.status(409).json({message: "Error. User already exists."});
  else 
    res.status(500).json({message: "Something looks wrong"});
});
app.listen(3000, function(){
 console.log('Node server listening on port 3000');
});