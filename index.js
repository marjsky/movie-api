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

// import auth.js into this file
app.use(bodyParser.urlencoded({ extended: true }));
let auth = require('./auth.js')(app);

// import passport.js and rquire passport module into this file
const passport = require('passport');
require('./passport.js');

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

//GET JSON genre into when looking for specific genre #3
app.get("/genre/:Name", (req, res) => {
  Movies.findOne({Name: req.params.Name})
  .then((genre) => {
      res.json(genre.Description);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
  });
});

//get info on director when looking for specific director #4
app.get("/director/:Name", (req, res) => {
  Movies.findOne({Name: req.params.Name})
  .then((director) => {
      res.json(director);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
  });
});

//Allow new users to register #5
/* We'll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
  Users.findOne({Username: req.body.Username})
  .then((user) => {
      if (user) {
          return res.status(400).send(req.body.Usernmae + 'already exits');
      } else {
          Users
              .create({
                  Username: req.body.Username,
                  Password: req.body.Password,
                  Email: req.body.Email,
                  Birthday: req.body.Birthday
              })
              .then((user) => {
                  res.status(201).json(user);
              })
              .catch((error) => {
                  console.error(error);
                  res.status(500).send('Error: ' + error);
              })
      }
  })
  .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
  });
});

//Allow users to update their user 
//info (username, password, email, date of birth) #6
app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate(
      {Username: req.params.Username},
      {
          $set: {
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birth: req.body.Birth,
          },
      },
      {new: true}, // This line maks sure that the update document is right
      (err, updatedUser) => {
          if (err) {
              console.error(err);
              res.status(500).send("Error: " + err);
          } else {
              res.json(updatedUser);
          }
      }
  );
});

//Allow users to add a movie to their list of favorites #7
app.post("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
      {Username: req.params.Username},
      {$push: { FavoriteMovies: req.params.MovieID }},
      {new: true}, // This line maks sure that the update document is right
      (err, updatedUser) => {
          if (err) {
              console.error(err);
              res.status(500).send("Error: " + err);
          } else {
              res.json(updatedUser);
          }
      }
  );
});

// Allow users to remove a movie from their list of favorites #8
app.delete("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
      {Username: req.params.Username },
      {$pull: { FavoriteMovies: req.params.MovieID}},
      {new: true},
      (error, updatedUser) => {
          if(error) {
              console.error(error);
              res.status(500).send("Error: " + error);
          } else {
              res.json(updatedUser);
          }
      }
  );
});

//allow user to deregister #9
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.listen(8080, () => {
  console.log('Server started on port 8080; press Ctrl-C to terminate...');
});