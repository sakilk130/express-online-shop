const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://admin:q9D88BcLquJCH3B7@cluster0.jmdlh.mongodb.net/express-online-shop?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('MongoDB Connected !!');
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect;
