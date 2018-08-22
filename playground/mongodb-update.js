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
// db.collection('Todos').findOneAndUpdate(
//   {
//     _id: new ObjectID('5b7db8818dd5b919a4b7f8f0')
//   }, {
//     $set: {
//       completed: 'true'
//     }
//   }, {
//     returnOriginal: false
//   }
// ).then(result => console.log(result));
db.collection('Users').findOneAndUpdate(
  {
    _id: new ObjectID('5b79c6e1e3d5b0260c6f8273')
  }, {
    $inc: {
      age: 1
    },
    $set: {
      name: 'shriniwas'
    },
  }, {
    returnOriginal: false
  }
).then(result => console.log(result));
  client.close();
});
