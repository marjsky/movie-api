const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());


  app.get('/movies', (req, res) => {
    res.status(200).json(movies);
  });
  
  app.get('/movies/:title', (req, res) => {
    const { title } = req.params.title;
    const movie = movies.find((movie) => movie.Title === title);
  
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).send('no movie');
    }
  });
  
  app.get('/movies/:genre/:genreName', (req, res) => {
    res.send('A JSON object holding data about a single genre, containing name and description.');
  });
  
  app.get('/movies/:director/:directorName', (req, res) => {
    res.send('A JSON object holding data about a single director, containing name, bio, birth year, and death year.');
  });
  
  app.put('/users', (req, res) => {
    res.send('A JSON object holding the updated user name and given id.');
  });
  
  app.put('/users/:id', (req, res) => {
    res.send('A text message indicating the username that was updated.');
  });
  
  app.post('/users/:id/:movieTitle', (req, res) => {
    res.send('Send text message movie title has been added to user id array.');
  });
  
  app.delete('/users/:id/:movieTitle', (req, res) => {
    res.send('A text message indicating whether the favorite movie title was successfully removed.');
  });
  
  app.delete('/users/:id', (req, res) => {
    res.send('A text message indicating user has been successfully removed.');
  });

app.listen(8080, () => {
  console.log('Server started on port 8080; press Ctrl-C to terminate...');
});