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


//When server starts:
app.on('listening', function () {
  Project.find({}).then((projects) => {
    console.log(projects);
  }).catch((e) => console.log(e));
});



//POST /projects
app.post('/projects', authenticate, (req, res) => {
  var project = new Project({
    title: req.body.title,
    description: req.body.description,
    postDuration: req.body.postDuration,
    _datePosted: new Date().getTime(),
    contactInfo: req.body.contactInfo,
    lookingFor: req.body.lookingFor,
    currentTeam: req.body.currentTeam,
    _creator: req.user._id
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
app.get('/projects', (req, res) => {
  Project.find({}).then((projects) => {
    res.send({projects});
  }, (e) => {
    res.status(400).send(e);
  });
});

//GET /projects/me
app.get('/projects/myprojects/', authenticate, (req, res) => {
  var usr = req.user;
  Project.find({_creator: usr._id}).then((projects) => {
    res.send(projects)
  }).catch((e) => res.status(400).send());
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
app.delete('/projects/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (ObjectID.isValid(id)) {
    Project.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((project) => {
      if (!project) {
        return res.status(404).send('No Project matching with the id')
      }
      return res.status(200).send(project);
    }).catch((e) => {
      res.status(400).send();
    });
  } else {
    return res.status(404).send('Please use a valid id');
  }
});


//PATCH /projects/:id
app.patch('/projects/:id', authenticate, (req, res) => {
  var usr = req.user
  var id = req.params.id
  var body = _.pick(req.body, ['title', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Project.findOneAndUpdate({_id: id, _creator: usr._id}, {$set: body}, {new: true}).then((project) => {
    if (!project) {
      return res.status(404).send();
    }

    res.send({project});
  }).catch((e) => {
    res.status(400).send();
  });
});




//USER ROUTES ----------------------------------------

//POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'bio']);
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

//GET /users/login
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(401).send()
  });
})


//PATCH /users/me/bio
app.patch('/users/me/bio', authenticate, (req, res) => {
  var usr = req.user;
  usr.bio = req.body.bio;
  console.log(usr);
  User.findOneAndUpdate({_id: usr._id}, {$set: usr}, {new: true}).then((user) => {
    if(!user) {
      return res.status(404).send();
    }

    res.status(200).send({user});
  }).catch((e) => res.status(400).send());
});





//DELETE /users/me/tokens  (logout - delete auth token)
app.delete('/users/me/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});




app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
