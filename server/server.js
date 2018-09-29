var express = require('express');
var bodyParser = require('body-parser')

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {ObjectID} = require('mongodb');


var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    completedAt: req.body.completedAt
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req,res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('Not Found');
  }

  Todo.findById(id).then((todo)=>{
    if(!todo) {
      return res.status(404).send('Not Found');
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });

});

app.listen(3000, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
