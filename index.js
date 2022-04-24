const res = require('express/lib/response');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/flixThis!', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  morgan = require('morgan');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');


//middleware
app.use(morgan('common'));
app.use(express.static('public'));

//routes
app.get('/', (req, res) => {
  res.send('Welcome to FlixThis!');
});


//CREATE SECTION

app.post('/users', passport.authenticate('jwt', {session: false}),
(req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => {res.status(201).json(user)})
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      }) 
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}),
 (req, res) => {
  Users.findOneAndUpdate({Username : req.params.Username}, 
    {$push: { FavoriteMovies: req.params.MovieID}}, 
    { new : true }) 
    .then((updatedUser) => {
        res.json(updatedUser); 
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//READ SECTION

app.get('/movies', passport.authenticate('jwt', {session: false}),
 (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/movies/:Title', passport.authenticate('jwt', {session: false}),
 (req, res) => {
  Movies.findOne({ Title: req.params.Title})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error:' + err);
    });
});

app.get('/movies/genre/:Name', passport.authenticate('jwt', {session: false}),
 (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name})
  .then((movie) => {
    res.json(movie.Genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error:' + err);
    });
});

  app.get('/movies/director/:Name', passport.authenticate('jwt', {session: false}), 
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name})
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
      });
  });

  app.get('/users', passport.authenticate('jwt', {session: false}),
   (req, res) => {
    Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

//UPDATE SECTION

app.put('/users/:Username', passport.authenticate('jwt', {session: false}),
 (req, res) => {
  Users.findOneAndUpdate({ Username : req.params.Username}, 
    {$set: { 
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
      }
    },
    { new : true }) 
    .then((updatedUser) => {
        res.json(updatedUser); 
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//DELETE SECTION

app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}),
 (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username},
    {$pull: {FavoriteMovies: req.params.MovieID}},
    { new: true})
    .then((updatedUser) => {
      res.json(updatedUser); 
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

app.delete('/Users/:Username', passport.authenticate('jwt', {session: false}),
(req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username})
    .then((user) => {
      if(!user) {
        res.status(400).send(req.params.Username = ' was not found');
      } else {
      res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
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

