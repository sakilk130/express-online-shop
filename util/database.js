const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://admin:q9D88BcLquJCH3B7@cluster0.jmdlh.mongodb.net/express-online-shop?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('MongoDB Connected !!');
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};
const getDB = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found !';
};
exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
