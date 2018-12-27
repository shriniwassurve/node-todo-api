require('./config/config.js');

var express = require('express');
var bodyParser = require('body-parser')
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate')

const {ObjectID} = require('mongodb');


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//add todo
app.post('/todos', authenticate, (req,res) => {
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    completedAt: req.body.completedAt,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

//add all todos
app.get('/todos', authenticate, (req,res) => {
  Todo.find({_creator: req.user._id}).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

//add todo by id
app.get('/todos/:id', authenticate, (req,res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('Not Found');
  }

  Todo.findOne({
    _id: id,
    _creator: req.user.id
  }).then((todo)=>{
    if(!todo) {
      return res.status(404).send('Not Found');
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });

});

//delete todo by id
app.delete('/todos/:id', authenticate,  (req,res) => {
  // console.log('user: ', req.user);
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    console.log('not valid');
    return res.status(404).send('Not Found');
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send('Not Found');
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// Update todo
app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('Not Found');
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

//add User
app.post('/users', (req,res) => {

  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  })
  .then((token) => {
    res.header('x-auth', token).send(user);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
});

// authenticate user
app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user);
});

// User login
app.post('/users/login', (req,res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
  .then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  })
  .catch((err) => {
    res.status(400).send(err);
  });
});

// User logout
app.delete('/users/me/token', authenticate, (req,res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  })
  .catch(() => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
