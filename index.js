const res = require("express/lib/response");
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect('mongodb://localhost:27017/flixThis!', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());
let auth = require("./auth")(app);

const passport = require("passport");
require("./passport");

const { check, validationResult } = require("express-validator"); //if API fails check this section

//middleware
app.use(morgan("common"));
app.use(express.static("public"));

//routes

/**
 * Gets "Welcome to FlixThis!" message.
 * @function get/welcome
 * @return Welcome message.
 */

app.get("/", (req, res) => {
  res.send("Welcome to FlixThis!");
});

//CREATE SECTION

/**
 * Creates a new user.
 * @function post/user
 * @params Username
 * @params Password
 * @params Email
 * @returns New user object.
 */

app.post(
  "/users",
  [
    check("Username", "Username is required fool!").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - we do not play that here..."
    ).isAlphanumeric(),
    check("Password", "Password is required, come on man.").not().isEmpty(),
    check(
      "Email",
      "Email does not appear to be valid, and I do not appear to be pleased."
    ).isEmail(),
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((err) => {
              console.error(err);
              res.status(500).send("Error: " + err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Adds a new favorite movie for a specific user.
 * @function post/movieByMovieID
 * @params Username
 * @params MovieID
 * @returns Updated user object with new favorite movie.
 */

app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//READ SECTION

/**
 * Gets list of all movies.
 * @function get/movies
 * @returns Array of all movies.
 */

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Gets a specific movie.
 * @function get/movieByTitle
 * @params Title
 * @returns Movie object.
 */

app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

/**
 * Gets a movie genre by name.
 * @function get/genreByName
 * @params Genre.Name
 * @returns Genre object.
 */

app.get(
  "/movies/genre/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then((movie) => {
        res.json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

/**
 * Gets a movie director by name.
 * @function get/directorByName
 * @params Director.Name
 * @returns Director object.
 */

app.get(
  "/movies/director/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

/**
 * Gets all users.
 * @function get/users
 * @returns An array of users.
 */

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Gets specific user.
 * @function get/userByUsername
 * @params Username
 * @returns A specific user object.
 */

app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//UPDATE SECTION

/**
 * Updates a specific user data.
 * @function put/userByUsername
 * @params Username
 * @params Password
 * @params Email
 * @returns User object with updated user info.
 */

app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required fool!").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - we do not play that here..."
    ).isAlphanumeric(),
    check("Password", "Password is required, come on man.").not().isEmpty(),
    check(
      "Email",
      "Email does not appear to be valid, and I do not appear to be pleased."
    ).isEmail(),
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//DELETE SECTION

/**
 * Deletes favorite movie from user.
 * @function delete/movieByMovieID
 * @params Username
 * @params MovieID
 * @returns Updated user object with previously favorite movie removed.
 */

app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error " + err);
      });
  }
);

/**
 * Deletes user.
 * @function delete/user
 * @params Username
 * @returns Message stating the user has either been deleted or does not currently exist.
 */

app.delete(
  "/Users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send((req.params.Username = " was not found"));
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Gets documentation file.
 * @function get/documentation
 * @returns documentation.html file.
 */

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

/**
 * Error handler.
 * @function err
 * @returns Error message.
 */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

/**
 * @constant
 * type {string}
 */

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
