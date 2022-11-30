const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  fs = require('fs'),
  path = require('path'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

const { check, validationResult } = require('express-validator');

const app = express();

// refer to the model names in the model.js
const Movies = Models.Movie; 
const Users = Models.User;

// allow Mongoose to connect database to perform CRUD operations
mongoose.connect(process.env.CONNECTION_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

//Cross-Orign Resource Sharing control domans have access to API server
const cors = require('cors');
app.use(cors());
let allowedOrigins = [
  "http://localhost:1234",
  "https://marjsky.github.io",
  "http://localhost:8080",
  "http://localhost:4200", 
  "https://marjsky-myflix.netlify.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn't found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn't allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);


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

/**
 * GET: returns documentation file
 * @returns documentation file
 */
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation',{root: __dirname});
});

// remove passport temporarily
/**
 * Returns list of all movies from database
 * Method: GET
 * @requires passport
 * @returns array of movie objects
 */
app.get("/movies", passport.authenticate('jwt', { session: false }) , (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(200).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status.apply(500).send("Error: " + err);
  });
});

// Read  all users
app.get("/users", passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.find()
  .then((users) => {
      res.json(users);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
  });
});

/**
 * Returns a user object by username
 * Method: GET
 * @param Username
 * @requires passport
 * @returns user object
 */
app.get("/users/:Username", passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOne({Username: req.params.Username})
  .then((user) => {
      res.json(user);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
  });
});

/**
 * Returns a movie by title
 * Method: GET
 * @param Title of movie
 * @requires passport
 * @returns movie object
 */
app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), (req, res) =>{
  Movies.findOne({Title: req.params.Title})
  .then((movie) => {
      res.json(movie);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
  });
});

/**
 * Returns a genre description by name
 * Method: GET
 * @param Name of genre
 * @requires passport
 * @returns genre description object
 */
app.get("/genre/:Name", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({Name: req.params.Name})
  .then((genre) => {
      res.json(genre.Description);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
  });
});

/**
 * Returns a director by name
 * Method: GET
 * @param Name of director
 * @requires passport
 * @returns director object
 */
app.get("/director/:Name", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({Name: req.params.Name})
  .then((director) => {
      res.json(director);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
  });
});

/**
 * Allow new users to register
 * Method: POST
 * {
 * ID: Integer,
 * Username: String,
 * Password: String,
 * Email: String,
 * Birthday: Date
 * }
 * @requires passport
 * @requires JSON object with user detials 
 * @returns user object
 */
app.post('/users', 
  // validation logic for request
  [
    check('Username', 'Username is required').isLength({ min: 5}),
    check('Username', 'Username contains non alphanumic characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
    (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({Username: req.body.Username}) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
            return res.status(400).send(req.body.Username + 'already exits');
        } else {
            Users
              .create({
                  Username: req.body.Username,
                  Password: hashedPassword,
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

//
//info (username, password, email, date of birth) #6
/**
 * Allow users to update their user by username
 * Method: PUT
 * @param username
 * @requires passport
 * @requires JSON object 
 * @returns user object 
 */
app.put("/users/:Username",
  // validation logic for update existing user
  [
    check('Username', 'Username is required').isLength({ min: 5}),
    check('Username', 'Username contains non alphanumic characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
        {Username: req.params.Username},
        {
            $set: {
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday,
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

/**
 * Return add a favorite movie  to user
 * method: POST
 * @param Username
 * @param movieID
 * @requires passport 
 * @returns user object 
 */
app.post("/users/:Username/movies/:MovieID", passport.authenticate('jwt', { session: false }), (req, res) => {
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

/**
 * Allow users to remove a movie from their list of favorites
 * Method: DELETE
 * @param Username
 * @param MovieID
 * @requires passport
 * @returns user object
 */
app.delete("/users/:Username/movies/:MovieID", passport.authenticate('jwt', { session: false }), (req, res) => {
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

/**
 * Allow user to deregister
 * Method: DELETE
 * @param Username
 * @requires passport
 * @returns message 
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Server started on port ' + port + '; press Ctrl-C to terminate...');
});