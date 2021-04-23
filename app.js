const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const shopRoutes = require('./routes/shop.js');
const adminRoutes = require('./routes/admin.js');
const PORT = process.env.PORT || 4000;
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  User.findOne({ where: { id: 1 } })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// error page
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then((results) => {
    return User.findOne({ where: { id: 1 } });
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'sakil khan', email: 'sakil@sakil.com' });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((cart) => {
    // console.log(user);
    app.listen(PORT, () => {
      console.log(`server is running on port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('ERROR=>', err);
  });
