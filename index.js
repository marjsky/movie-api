const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();

const  accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'}) 

app.use(morgan('combined', {stream: accessLogStream}));

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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Server started on port 8080; press Ctrl-C to terminate...');
});