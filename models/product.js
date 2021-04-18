const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = (callback) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProduct = [...products];
        updatedProduct[existingProductIndex] = this;

        fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
          console.log(updatedProduct);
        });
      } else {
        this.id = Math.floor(Math.random() * 1000000000000000).toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(products);
        });
      }
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(productId, callback) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === productId);
      callback(product);
    });
  }
};
