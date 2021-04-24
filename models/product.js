const getDB = require('../util/database').getDB;
const mongodb = require('mongodb');
class Product {
  constructor(id, title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this.id = id;
  }
  save() {
    const db = getDB();
    let dbOp;

    if (this.id) {
      dbOp = db
        .collection('products')
        .updateOne({ _id: new mongodb.ObjectId(this.id) }, { $set: this });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static fetchAll() {
    const db = getDB();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(ProdId) {
    const db = getDB();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(ProdId) })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
