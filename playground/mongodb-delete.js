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
//deletemany
// db.collection('Todos').deleteMany({text: 'eat dinner'}).then((result) => {
//   console.log(result);
// });
//deleteone
// db.collection('Todos').deleteOne({text: 'eat dinner'}).then((result) => {
//   console.log(result);
// });
//findOneAndDelete
// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
//   console.log(result);
// });

// db.collection('Users').deleteMany({name: 'niwas'});
db.collection('Users').findOneAndDelete({
  _id: new ObjectID('5b79c4205401d10b1448417a')
}).then(result => console.log(JSON.stringify(result, undefined, 2)));

  client.close();
});
