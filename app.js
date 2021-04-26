const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const shopRoutes = require('./routes/shop.js');
const adminRoutes = require('./routes/admin.js');
const PORT = process.env.PORT || 4000;
const errorController = require('./controllers/error');
// const User = require('./models/user');
const mongoose = require('mongoose');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// app.use((req, res, next) => {
//   User.findById('6083f65e2c701bb719dceaa0')
//     .then((user) => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// error page
app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://admin:q9D88BcLquJCH3B7@cluster0.jmdlh.mongodb.net/express-online-shop?retryWrites=true&w=majority'
  )
  .then((result) => {
    console.log('Mongoose Connected !!');
    app.listen(PORT, () => {
      console.log(`server is running on port : ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
