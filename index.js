const express = require('express'),
    morgan = require('morgan');

const app = express();

app.use(express.static('public')); // route request for file corresponding to folder on server

let topTenMovies = [
    {
        title: 'Hancock',
        genre: 'Action/Fantasy'
    },
    {
        title: 'The Way Back',
        genre: 'Sport/Drama'
    },
    {
        title: 'Gamer',
        genre: 'Action/Sci-fi'
    },
    {
        title: 'Divergent',
        genre: 'Action/Sci-fi'
    },
    {
        title: 'The Man from Toronto',
        genre: 'Action/Comedy'
    },
    {
        title: 'Mars Attacks!',
        genre: 'Sci-fi/Comedy'
    },
    {
        title: 'Drumline: A New Beat',
        genre: 'Drama/Comedy music'
    },
    {
        title: 'Zygote',
        genre: 'Short/Sci-Fi Horror'
    },
    {
        title: 'Aquaman',
        genre: 'Action/Adventure'
    },
    {
        title: 'Life',
        genre: 'Sci-fi/Horror'
    }
];

app.get('/movie', (req, res) => {
    res.json(topTenMovies);
});

app.get('/', (req, res) => {
    let responseText = 'Amazing, this is working!';
    res.send(responseText);
});

app.get('/documentation.html', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname});
});
