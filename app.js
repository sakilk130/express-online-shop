const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const shopRoutes = require('./routes/shop.js');
const adminRoutes = require('./routes/admin.js');
const PORT = process.env.PORT || 4000;
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const getDB = require('./util/database').getDB;
const User = require('./models/user');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById('6083f65e2c701bb719dceaa0')
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
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

mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`server is running on port : ${PORT}`);
  });
});
