const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = Schema({
  title: {
    type: String,
    requird: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
