const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
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
  addToCart(product) {
    const updateCart = { items: [{ productId: product._id, quantity: 1 }] };
    const db = getDB();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updateCart } }
      );
  }
}
module.exports = User;
