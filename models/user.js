const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  save() {
    const db = getDB();
    return db.collection('users').insertOne(this);
  }
  static findById(userId) {
    const db = getDB();
    return db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
module.exports = User;
