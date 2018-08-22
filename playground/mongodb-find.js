// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

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


  db.collection('Users').find({
    name: 'Tushar'
  }).toArray().then((docs) => {
    console.log('Users');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch Users');
  });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('Unable to fetch Todos');
  // });

  client.close();
});
