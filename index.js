const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  morgan = require('morgan');

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: 'Andrea',
    favoriteMovies: []
  },
  {
    id: 2,
    name: 'Brett',
    favoriteMovies: ['K-Pax']
  },
];

let topTen = [
    {
        name: 'K-Pax',
        starring: ['Kevin Spacey', 'Jeff Bridges'],
        genre: 'Drama',
        released: '2001'
    },
    {
        name: 'MacGruber',
        starring: ['Will Forte', 'Kristen Wiig', 'Ryan Phillippe'],
        genre: 'Comedy',
        released: '2010'
    },
    {
        name: 'The Perks of Being a Wallflower',
        starring: ['Logan Lerman', 'Emma Watson', 'Ezra Miller'],
        genre: 'Drama',
        released: '2012'
    },
    {
        name: 'Donnie Darko',
        starring: ['Jake Gyllenhaal', 'Maggie Gyllenhaal'],
        genre: 'Thriller',
        released: '2001',
    },
    {
        name: 'Moon',
        starring: ['Sam Rockwell', 'Kevin Spacey'],
        genre: ['Sci-fi, Thriller'],
        released: '2009'
    },
    {
        name: 'Icarus',
        starring: ['Bryan Fogel', 'Grigory Rodchenkov'],
        genre: 'Documentary',
        released: '2017'
    },
    {
        name: 'Snatch',
        starring: ['Brad Pitt', 'Jason Statham', 'Vinnie Jones'],
        genre: 'Action',
        released: '2000'
    },
    {
        name: 'Trainspotting',
        starring: ['Ewan McGregor', 'Jonny Lee Miller'],
        genre: {
            name: 'Drama',
            description: 'Drama instills intense emotional responses of both good and bad connotation.'
        },
        released: '1996'
    },
    {
        name: 'I Love You, Man',
        starring: {
            name: 'Paul Rudd',
            birthdate: 'Great day & year.',
            deathdate: 'Hopefully never.'
        },
        genre: {
            name: 'Comedy',
            description: 'Funny HAHAHA stuff.',
        },
        released: '2009'
    },
    {
        name: 'Birdman',
        starring: ['Michael Keaton', 'Emma Stone', 'Edward Norton'],
        genre: ['Drama, Thriller'],
        released: '2014'
    },
];


//middleware
app.use(morgan('common'));
app.use(express.static('public'));

//routes
app.get('/', (req, res) => {
  res.send('Welcome to FlixThis!');
});


//CREATE SECTION
app.post('/users', (req, res) => {
    const newUser = req.body;

   if (newUser.name) {
     newUser.id = uuid.v4();
     users.push(newUser);
     res.status(201).json(newUser)
   } else {
     res.status(400).send('users be needing names')
   } 
});

app.post('/users/:id/:movieName', (req, res) => {
  const { id, movieName } = req.params;

  let user = users.find (user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieName);
    res.status(200).send(`${movieName} has been added to user ${id}'s array`);
  } else {
    res.status(400).send()
  }
});


//READ SECTION
app.get('/movies', (req, res) => {
  res.json(topTen);
});

app.get('/movies/:name', (req, res) => {
    const { name } = req.params;
    const movie = topTen.find(movie => movie.name === name);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('NO MOVIE!')
    }
});

app.get('/movies/genre/:name', (req, res) => {
  const { name } = req.params;
  const genre = topTen.find(movie => movie.genre.name === name ).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('NO GENRE!!');
  }
});

app.get('/movies/starring/:name', (req, res) => {
    const { name } = req.params;
    const starring = topTen.find(movie => movie.starring.name === name).starring;
  
    if (starring) {
      res.status(200).json(starring);
    } else {
      res.status(400).send('Actor could not be located!!!')
    }
  });

//UPDATE SECTION
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

let user = users.find(user => user.id == id);

if (user) {
  user.name = updatedUser.name;
  res.status(200).json(user);
} else {
  res.status(400).send('no user exists')
}
});

//DELETE SECTION
app.delete('/users/:id/:movieName', (req, res) => {
  const { id, movieName } = req.params;

  let user = users.find (user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(name => name !== movieName);
    res.status(200).send(`${movieName} has been deleted from user ${id}'s array`);
  } else {
    res.status(400).send()
  }
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find (user => user.id == id);

  if (user) {
    users = users.filter(user => user.id != id);
    res.status(200).send(` user ${id} has been deleted`);
  } else {
    res.status(400).send('no such user')
  }
});


app.get('/documentation', (req, res) => {
	res.sendFile('public/documentation.html', { root: __dirname });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});