# **MyFlix**

## Project Objective

To build the server-side component of a “movies” web application. The web
application will provide users with access to information about different
movies, directors, and genres. Users will be able to sign up, update their
personal information, and create a list of their favorite movies.

## User Stories

- As a user, I want to be able to receive information on movies, directors, and genres so that I can learn more about movies I’ve watched or am interested in.
- As a user, I want to be able to create a profile so I can save data about my favorite movies.

## Key Features

- Return a list of ALL movies to the user.
- Return data (description, genre, director, image URL, whether it’s featured or not) about a
  single movie by title to the user.
- Return data about a genre (description) by name/title (e.g., “Thriller”).
- Return data about a director (bio, birth year, death year) by name.
- Allow new users to register.
- Allow users to update their user info (username, password, email, date of birth).
- Allow users to add a movie to their list of favorites.
- Allow users to remove a movie from their list of favorites.
- Allow existing users to deregister.

## Tech Used

- JavaScript
- Node.js
- Express
- MongoDB
- Mongoose

### Dependencies

```

 "dependencies": {
    "bcrypt": "^5.0.1",
    "body-parser": "^1.20.0",
    "cors": "^2.8.5",
    "express": "^4.17.3",
    "express-validator": "^6.14.0",
    "jsonwebtoken": "^8.5.1",
    "lodash": "^4.17.21",
    "mongoose": "^6.2.8",
    "morgan": "^1.10.0",
    "passport": "^0.5.2",
    "passport-jwt": "^4.0.0",
    "passport-local": "^1.0.0",
    "uuid": "^8.3.2"
  },
  "devDependencies": {
    "eslint": "^8.1.0",
    "nodemon": "^2.0.15"
  }
```
