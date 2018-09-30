
const {mongoose} = require('./../server/db/mongoose');

const {Todo} = require('./../server/models/todo');

//deletemany
// Todo.remove({}).then((result) => {
//   console.log(result);
// });
// Todo.findOneAndRemove({_id: '5bafe5f4cabf114b087e9188'}).then((todo) => {
//   console.log(todo);
// });

Todo.findByIdAndRemove('5bafe5f4cabf114b087e9188').then((todo) => {
  console.log(todo);
});
