require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/user.js');
var {Project} = require('./models/project.js');
var {authenticate} = require('./middleware/authenticate');



var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());



//POST /projects
app.post('/projects', authenticate, (req, res) => {
  var project = new Project({
    title: req.body.title,
    description: req.body.description,
    postDuration: req.body.postDuration
  });

  project.save().then((doc) => {
    setTimeout(function () {
      Project.findByIdAndRemove((doc._id), (err) => {})
    }, doc.postDuration)
    res.send(doc)
  }, (e) => {
    res.status(400).send(e);
  });
});


//GET /projects
app.get('/projects', authenticate, (req, res) => {
  Project.find({}).then((projects) => {
    res.send({projects});
  }, (e) => {
    res.status(400).send(e);
  });
});


//GET /projects/:id
app.get('/projects/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (ObjectID.isValid(id)) {
    Project.findById(id).then((doc) => {
      if (!doc) {
        return res.status(404).send();
      }
      res.send(doc);
    }, e => res.status(400).send(e))
  } else {
    return res.status(404).send('Please enter a valid objectID');
  }
});

//DELETE /projects/:id



//PATCH /projects/:id



//USER ROUTES ----------------------------------------

//POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => res.status(400).send());
});

//POST /users/me
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
});

//GET /users/me/:token (sends the user credentials)


//POST /users/login  (generate auth token)


//DELETE /users/me/tokens  (logout - delete auth token)




















app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
