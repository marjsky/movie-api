const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const movies = [
    {
      title: 'Hancock',
      description: 'Hancock is a superhero whose ill-considered behavior regularly causes damage in the millions. He changes when the person he saves helps him improve his public image.',
      genre: {
        name: 'Action/Fantasy',
        description: 'The powerful superhero John Hancock has become a joke because of his alcoholism and clumsiness. He has also become the most hated man in Los Angeles. Though he has saved many lives, he also destroyed a lot of property, costing the city millions every time he goes into action. When he saves the life of PR expert Ray Embrey from an oncoming train, the executive is thankful and believes he can restore Hancock\'s image as a true superhero. He brings the anti-hero home for dinner and introduces him to his son Aaron, a big fan, and to his wife, Mary. But for some mysterious reason Mary doesn\'t want Hancock anywhere near her or her family.',
      },
      director: {
        name: 'Peter Berg',
        bio: 'Peter Berg is an American actor, director, writer, and producer. His first role was in the Adam Rifkin road movie Never on Tuesday (1988). He went on to star in the World War 2 film A Midnight Clear (1992). Roles in Fire in the Sky (1993) and Cop Land (1997) followed, and the Tom Cruise films Collateral (2004) and Lions for Lambs (2007).',
        birth: 'March 22, 1964',
      },
      imageURL: 'https://www.imdb.com/title/tt0448157/mediaviewer/rm871864576/?ref_=tt_ov_i',
      featured: false,
    },
    {
      title: 'The Way Back',
      description: 'Jack Cunningham was a high school basketball phenom who walked away from the game, forfeiting his future. Years later, when he reluctantly accepts a coaching job at his alma mater, he may get one last shot at redemption.',
      genre: {
        name: 'Sport/Drama',
        description: 'Back in high school, Jack Cunningham had everything going for him. A basketball phenom, he could have punched his ticket to college or even the pros, but, instead, he chose to walk away from the game, forfeiting his future. Jack\'s glory days are long gone...but, as it turns out, not forgotten. Years later, he gets the chance to take back his life when he is asked to coach the struggling basketball team at his alma mater. Jack reluctantly accepts, surprising no one more than himself, and as the boys start to come together as a team and win, he may get his last shot at redemption.',
      },
      director: {
        name: 'Gavin O\'Connor',
        bio: 'Peter Berg is an American actor, director, writer, and producer. His first role was in the Adam Rifkin road movie Never on Tuesday (1988). He went on to stGavin O\'Connor was born on December 24, 1963 in Huntington, Long Island, New York, USA. He is a producer and director, known for The Accountant (2016), Pride and Glory (2008) and Warrior (2011). He has been married to Brooke Burns since June 22, 2013. They have one child. He was previously married to Angela Shelton.ar in the World War 2 film A Midnight Clear (1992). Roles in Fire in the Sky (1993) and Cop Land (1997) followed, and the Tom Cruise films Collateral (2004) and Lions for Lambs (2007).',
        birth: 'December 24, 1963',
      },
      imageURL: 'https://www.imdb.com/title/tt8544498/mediaviewer/rm2478489345/?ref_=tt_ov_i',
      featured: false,
    },
    {
      title: 'Gamer',
      description: 'In a future mind-controlling game, death row convicts are forced to battle in a \'Doom\'-type environment. Convict Kable, controlled by Simon, a skilled teenage gamer, must survive thirty sessions in order to be set free.',
      genre: {
        name: 'Action/Sci-fi',
        description: "Ken Castle is extremely rich, popular, and powerful since he invented and started exploiting the virtual online parallel reality games. In these games, people can either pay to be a user or get paid to be an 'actor' in a system of mind-control. In the ultimate version, Slayers, death row convicts act as gladiators in a desperate dim bid for survival, which no one has achieved yet. The champion, John 'Kable' Tillman, is scheduled to die just before he'd gain release, but he persuades his teenage 'handler' to hand over the reins so he can fully use his talents and experience. Kable escapes to freedom, but Castle's men chase him. Kable has to fight his way back to Castle's headquarters to challenge his hidden evil plans.",
      },
      director: {
        name: 'Mark Neveldine',
        bio: 'Mark Neveldine was born on May 11, 1973 in Watertown, New York, USA. He is known for Gamer (2009), Crank: High Voltage (2009) and Crank (2006). He has been married to Alison Lohman since August 19, 2009. They have three children.',
        birth: 'May 11, 1973',
      },
      imageURL: 'https://www.imdb.com/title/tt1034032/mediaviewer/rm1878165504/?ref_=tt_ov_i',
      featured: false,
    },
    {
      title: 'Divergent',
      description: "In a world divided by factions based on virtues, Tris learns she's Divergent and won't fit in. When she discovers a plot to destroy Divergents, Tris and the mysterious Four must find out what makes Divergents dangerous before it's too late.",
      genre: {
        name: 'Action/Sci-fi',
        description: "Set in a futuristic dystopia where society is divided into five factions that each represent a different virtue, teenagers have to decide if they want to stay in their faction or switch to another - for the rest of their lives. Tris Prior makes a choice that surprises everyone. Then Tris and her fellow faction-members have to live through a highly competitive initiation process to live out the choice they have made. They must undergo extreme physical and intense psychological tests, that transform them all. But Tris has a secret that she is Divergent, which means she doesn't fit into any one group. If anyone knew, it would mean a certain death. As she discovers a growing conflict that threatens to unravel her seemingly peaceful society, this secret might help her save the people she loves... or it might destroy her.",
      },
      director: {
        name: 'Neil Burger',
        bio: 'Neil Burger is an American film and television director, writer, and producer. Most recently, he wrote and directed Voyagers (2021), starring Colin Farrell, Tye Sheridan, and Lily-Rose Depp. He is also known for The Upside (2017), Divergent (2014), Limitless (2011), and The Illusionist (2006). For television, Burger directed and executive produced.',
        birth: 'June 22, 1963',
      },
      imageURL: 'https://www.imdb.com/title/tt1840309/mediaviewer/rm2855260672/?ref_=tt_ov_i',
      featured: false,
    },
    {
      title: 'The Man from Toronto',
      description: "The world's deadliest assassin and New York's biggest screw-up are mistaken for each other at an Airbnb rental.",
      genre: {
        name: 'Action/Comedy',
        description: 'Somewhere in the desert, an assassin known only as "The Man From Toronto" (Woody Harrelson), arrives at a cabin to interrogate a suspect. Toronto gets ready to carve into the suspect with a hot knife, but the man becomes terrified and promptly gives up the information he wants. After Toronto leaves, the suspect is shot and killed by the man who called Toronto.',
      },
      director: {
        name: 'Patrick Hughes',
        bio: "Australian-born writer, producer and director Patrick Hughes continues to establish himself as one of Hollywood's most in-demand filmmakers by bringing compelling material to global audiences anchored by striking visuals and comedic storytelling.",
        birth: 'March 12, 1978',
      },
      imageURL: 'https://www.imdb.com/title/tt11671006/mediaviewer/rm53481729/?ref_=tt_ov_i',
      featured: false,
    },
  ];
  
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