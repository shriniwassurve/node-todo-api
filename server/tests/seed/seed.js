const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID;
const userTwoId = new ObjectID;

const todos = [
  {
    _id: new ObjectID,
    text: 'First test todo',
    _creator: userOneId
  }, {
    _id: new ObjectID,
    text: 'Second test todo',
    completed: true,
    completedAt: 1234,
    _creator: userTwoId
  }
];

const users = [
  {
    _id: userOneId,
    email : 'shriniwas.surve@gmail.com',
    password: 'abcd123',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }, {
    _id: userTwoId,
    email : 'shriniwas.surve@example.com',
    password: 'abcd123',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }
]

var populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
}

var populateUsers = (done) => {
  User.remove({}).then(() => {
    // return User.insertMany(users);
    const userOne = new User(users[0]).save(); //  this is because we call hash password before each save
    const userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
}

module.exports = {todos, populateTodos, users, populateUsers};
