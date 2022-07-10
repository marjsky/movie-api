const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  fs = require('fs'),
  path = require('path'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

const app = express();

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
      featured: true,
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
        bio: 'Gavin O Connor was born on December 24, 1963 in Huntington, Long Island, New York, USA. He is a producer and director, known for The Accountant (2016), Pride and Glory (2008) and Warrior (2011). He has been married to Brooke Burns since June 22, 2013. They have one child. He was previously married to Angela Shelton.',
        birth: 'December 24, 1963',
      },
      imageURL: 'https://www.imdb.com/title/tt8544498/mediaviewer/rm2478489345/?ref_=tt_ov_i',
      featured: true,
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
      featured: true,
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
      featured: true,
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
      featured: true,
    },
    {
      Title: "Friday Night Lights",
      Description: "Based on H.G. Bissingers book, which profiled the economically depressed town of Odessa, Texas and their heroic high school football team, The Permian High Panthers.",
      Genre: {
        Name: "Drama",
        Description: "A straight arrow coach leads his team to the 1988 Texas state semifinals in the west Texas city of Odessa, where high school football is king. Expectations of classmates, coaches, family, and community members exact a toll on the athletes central to the story. Economic and racial undertones pervade this adaptation of H.G. Bissinger's book by the same name."
        },
      Director: {
        Name:"Peter Berg",
        Bio: "Peter Berg is an American actor, director, writer, and producer. His first role was in the Adam Rifkin road movie Never on Tuesday (1988). He went on to star in the World War 2 film A Midnight Clear (1992). Roles in Fire in the Sky (1993) and Cop Land (1997) followed, and the Tom Cruise films Collateral (2004) and Lions for Lambs (2007).",
        Birth: "3/11/1964"
        },
      ImagePath: "https://www.imdb.com/title/tt0390022/mediaviewer/rm3683556608/?ref_=tt_ov_i",
      Featured: true
    },
    {
      Title: "Moon Knight",
      Description: "Steven Grant discovers he been granted the powers of an Egyptian moon god. But he soon finds out that these newfound powers can be both a blessing and a curse to his troubled life.",
      Genre: {
        Name: "Adventure",
        Description: "The series follows Steven Grant, a mild- mannered gift-shop employee, who becomes plagued with blackouts and memories of another life. Steven discovers he has dissociative identity disorder and shares a body with mercenary Marc Spector. As Steven/Marc's enemies converge upon them, they must navigate their complex identities while thrust into a deadly mystery among the powerful gods of Egypt."
        },
      Director: {
        Name:"Doug Moench",
        Bio: "Doug Moench was born on February 23, 1948 in Chicago, Illinois, USA. He is a writer and actor, known for Union Jack (2019), Batman Ninja (2018) and Young Justice (2010). He is married to Deborah. They have one child.",
        Birth: "2/23/1948"
        },
      ImagePath: "https://www.imdb.com/title/tt10234724/mediaviewer/rm1390285313/?ref_=tt_ov_i",
      Featured: true
    },
    {
      Title: "Irresistible",
      Description: "A Democratic strategist helps a retired veteran run for mayor in a small, conservative Midwest town.",
      Genre: {
        Name: "Comedy",
        Description: "Partially inspired by the 2017 special election for Georgia's 6th congressional district, where the Democratic and Republican parties and groups supporting them spent more than $55 million combined - the most expensive House Congressional election in U.S. history."
        },
      Director: {
        Name:"Jon Stewart",
        Bio: "Jon Stewart was born Jonathan Stuart Leibowitz in New York City, New York, to Marian (Laskin), a teacher, and Donald Leibowitz, a physics professor. His family is Ashkenazi Jewish (from Austria, Ukraine, Poland, and Belarus). Stewart moved to Lawrenceville, New Jersey during his childhood. He graduated from the College Of William And Mary in Williamsburg, Virginia, in 1984. He made his breakthrough on The Larry Sanders Show (1992), where he had a role playing himself, the oft-timed \"Guest Host\" of \"The Larry Sanders Show\". He became as much a part of the show's fabric as some of the regular performers.",
        Birth: "11/28/1962"
        },
      ImagePath: "https://www.imdb.com/title/tt9076562/mediaviewer/rm3713444353/?ref_=tt_ov_i",
      Featured: true
    },
    {
      Title: "The Pursuit of Happyness",
      Description: "A struggling salesman takes custody of his son as he is poised to begin a life-changing professional career.",
      Genre: {
        Name: "Biography",
        Description: "Based on a true story about a man named Christopher Gardner. Gardner has invested heavily in a device known as a \"bone density scanner\". He feels like he has it made selling these devices. However, they do not sell well as they are marginally better than x-ray at a much higher price. As Gardner works to make ends meet, his wife leaves him and he loses his apartment. Forced to live out in the streets with his son, Gardner continues to sell bone density scanners while concurrently taking on an unpaid internship as a stockbroker, with slim chances for advancement to a paid position. Before he can receive pay, he needs to outshine the competition through 6 months of training, and to sell his devices to stay afloat."
        },
      Director: {
        Name:"Gabriele Muccino",
        Bio: "Gabriele Muccino was born on May 20, 1967 in Rome, Lazio, Italy. He is a director and writer, known for Seven Pounds (2008), The Pursuit of Happyness (2006) and The Last Kiss (2001). He has been married to Angelica Russo since December 22, 2012. They have one child. He was previously married to Elena Majoni.",
        Birth: "5/20/1967"
        },
      ImagePath: "https://www.imdb.com/title/tt0454921/mediaviewer/rm2553318400/?ref_=tt_ov_i",
      Featured: true
    },
    {
      Title: "Just Mercy",
      Description: "World-renowned civil rights defense attorney Bryan Stevenson works to free a wrongly condemned death row prisoner.",
      Genre: {
        Name: "Crime",
        Description: "After graduating from Harvard, Bryan Stevenson heads to Alabama to defend those wrongly condemned or those not afforded proper representation. One of his first cases is that of Walter McMillian, who is sentenced to die in 1987 for the murder of an 18-year-old girl, despite evidence proving his innocence. In the years that follow, Stevenson encounters racism and legal and political maneuverings as he tirelessly fights for McMillian's life."
        },
      Director: {
        Name:"Destin Daniel Cretton",
        Bio: "Destin Daniel Cretton is an American filmmaker, writer and producer from Haiku, Hawaii. He is known for directing The Glass Castle, I Am Not a Hipster, Short Term 12, Just Mercy and Shang-Chi and the Legend of the Ten Rings. He is the second Asian-American filmmaker to direct a Marvel film following Ang Lee's Hulk.",
        Birth: "11/23/1978"
        },
      ImagePath: "https://www.imdb.com/title/tt4916630/mediaviewer/rm638288385/?ref_=tt_ov_i",
      Featured: true
    }
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