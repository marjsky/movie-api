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
mongoose.connect('mongodb://localhost:27017/daflix', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.json()); //Returns middleware parses json looks at requests the Content-Type header matches the type option.

app.use(bodyParser.urlencoded({ extended: true })); // Returns middleware parses urlencoded bodies 


  

app.listen(8080, () => {
  console.log('Server started on port 8080; press Ctrl-C to terminate...');
});