const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const shopRoutes = require('./routes/shop.js');
const adminRoutes = require('./routes/admin.js');
const PORT = process.env.PORT || 4000;
const errorController = require('./controllers/error');
const User = require('./models/user');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth.js');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById('60865f4a63b9470ab8c04256')
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
app.use(authRoute);

// error page
app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://admin:q9D88BcLquJCH3B7@cluster0.jmdlh.mongodb.net/express-online-shop?retryWrites=true&w=majority'
  )
  .then((result) => {
    const user = new User({
      name: 'sakil',
      email: 'sakil@sakil.com',
      cart: { items: [] },
    });
    User.findOne().then((result) => {
      if (!result) {
        user.save();
      }
      app.listen(PORT, () => {
        console.log(`server is running on port : ${PORT}`);
      });
    });
  })
  .catch((err) => console.log(err));
