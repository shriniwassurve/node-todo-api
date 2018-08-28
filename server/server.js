var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true});

var Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

// var newTodo = new Todo({
//   text: 'cooked dinner'
// });

var newTodo = new Todo({
  text: 'read book',
  completed: 'ghj',
  completedAt: 10
});

newTodo.save().then((doc)=> {
  console.log('saved', JSON.stringify(doc, undefined, 2));
}, (e) => {
  console.log('unable to save todo', e);
});
