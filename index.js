const express = require('express');
  morgan = require('morgan');

const app = express();

let topTen = [
    {
        name: 'K-Pax',
        starring: ['Kevin Spacey', 'Jeff Bridges'],
        released: '2001'
    },
    {
        name: 'MacGruber',
        starring: ['Will Forte', 'Kristen Wiig', 'Ryan Phillippe'],
        released: '2010'
    },
    {
        name: 'The Perks of Being a Wallflower',
        starring: ['Logan Lerman', 'Emma Watson', 'Ezra Miller'],
        released: '2012'
    },
    {
        name: 'Donnie Darko',
        starring: ['Jake Gyllenhaal', 'Maggie Gyllenhaal'],
        released: '2001',
    },
    {
        name: 'Moon',
        starring: ['Sam Rockwell', 'Kevin Spacey'],
        released: '2009'
    },
    {
        name: 'Icarus',
        starring: ['Bryan Fogel', 'Grigory Rodchenkov'],
        released: '2017'
    },
    {
        name: 'Snatch',
        starring: ['Brad Pitt', 'Jason Statham', 'Vinnie Jones'],
        released: '2000'
    },
    {
        name: 'Trainspotting',
        starring: ['Ewan McGregor', 'Jonny Lee Miller'],
        released: '1996'
    },
    {
        name: 'I Love You, Man',
        starring: ['Paul Rudd' , 'Jason Segel', 'Rashida Jones'],
        released: '2009'
    },
    {
        name: 'Birdman',
        starring: ['Michael Keaton', 'Emma Stone', 'Edward Norton'],
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

app.get('/movies', (req, res) => {
  res.json(topTen);
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