// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

console.log(obj);

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'TodoApp';

// Use connect method to connect to the server
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }
  //assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  // db.collection('Todos').insertOne({
  //   test: 'Something not to do',
  //   completed: false
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert todo3asd', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
  // db.collection('Users').insertOne({
  //   name: 'shriniwas',
  //   age: 23,
  //   location: 'mumbai'
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert user', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  // });

  client.close();
});
