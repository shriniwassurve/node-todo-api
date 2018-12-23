const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken')

var data = {
  id: 4
}

var token =  jwt.sign(data, 'Secret key');
var decoded = jwt.verify(token, 'Secret key');
console.log(token);
console.log(decoded);

// var message = 'I am user';
// var hash = SHA256(message).toString();
//
// // console.log(message);
// // console.log(hash);
//
//
// var data = {
//   id: 4
// }
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'some secret').toString()
// }
//
// // modify data
// token.data.id  = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString()
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'some secret').toString();
//
// if (token.hash === resultHash){
//   console.log('Data was not modified.');
// } else {
//   console.log('Data was modified! Do not trust!');
// }
