const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const shopRoutes = require('./routes/shop.js');
const adminRoutes = require('./routes/admin.js');
const PORT = process.env.PORT || 4000;
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const getDB = require('./util/database').getDB;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  // User.findOne({ where: { id: 1 } })
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  next();
});
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', adminRoutes);
// app.use(shopRoutes);

// error page
app.use(errorController.get404);

mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`server is running on port : ${PORT}`);
  });
});
