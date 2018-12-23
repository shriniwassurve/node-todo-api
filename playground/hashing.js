const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err,hash) => {
    console.log(hash);
  });
})

var hashedPassword = '$2a$10$ufuAv/Iwf3HAq789mX9cIevlVtBs0ZhKe1mVBpJMKZTQg10fQbJMq';

bcrypt.compare(password, hashedPassword, (error,result) => {
  console.log(result);
});



// var data = {
//   id: 4
// }
//
// var token =  jwt.sign(data, 'Secret key');
// var decoded = jwt.verify(token, 'Secret key');
// console.log(token);
// console.log(decoded);

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
