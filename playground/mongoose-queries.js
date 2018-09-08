const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const {User} =require('./../server/models/user')

var id  = '5b93bf49e6cbec24b079f4d3';

// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// } else {
//   Todo.find({
//     _id: id
//   }).then((todos) => {
//     console.log('Todos', todos);
//   });
//
//   Todo.findOne({
//     _id: id
//   }).then((todo) => {
//     if(!todo) {
//       return console.log('Document not found');
//     }
//     console.log('Todo', todo);
//   });
//
//   Todo.findById(id).then((todo) => {
//     if(!todo) {
//       return console.log('Id not found');
//     }
//     console.log('Todo By id', todo);
//   }).catch((e) => console.log(e));
// }



var userId = '5b85a118a225f240a06e9273'
if (!ObjectID.isValid(userId)) {
 return console.log('ID not valid');
}

User.findById(userId).then((user) => {
  if(!user) {
    return console.log('Unable to find user');
  }
  console.log('User By id', JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
