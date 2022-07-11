const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  fs = require('fs'),
  path = require('path'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

const app = express();

// refer to the model names in the model.js
const Movies = Models.Movie; 
const Users = Models.User;

// allow Mongoose to connect database to perform CRUD operations
mongoose.connect('mongodb://localhost:27017/test', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});


app.use(bodyParser.json()); //Returns middleware parses json looks at requests the Content-Type header matches the type option.

app.use(bodyParser.urlencoded({ extended: true })); // Returns middleware parses urlencoded bodies 

// access documentation.html using express.static
app.use("/documentation", express.static("public"));

//morgan request logger
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'log.txt'), {flags: 'a+'}
)
app.use(morgan('combined', {stream: accessLogStream}));

//error handing
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error");
})  

// default text response when at /
app.get("/", (req, res) => {
  res.send("Welcome to DaFlix!");
});

//#1 return JSON object when at /movie 
app.get("/movies", (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status.apply(500).send("Error: " + err);
  });
});

app.get("/users", function (req, res) {
  Users.find()
  .then((users) => {
      res.status(201).json(users);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
  });
});

//GET JSON movie into when looking for specific title #2
app.get("/movies/:Title", (req, res) =>{
  Movies.findOne({Title: req.params.Title})
  .then((movie) => {
      res.json(movie);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
  });
});

app.listen(8080, () => {
  console.log('Server started on port 8080; press Ctrl-C to terminate...');
});