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
const session = require('express-session');
const MongoSessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const MONGODB_URL =
  'mongodb+srv://admin:OSLG4FkU6AaIRWpF@cluster0.jmdlh.mongodb.net/express-online-shop?retryWrites=true&w=majority';

const MongoDBStore = new MongoSessionStore({
  uri: MONGODB_URL,
  collection: 'sessions',
});

const csrfProtection = csrf();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoDBStore,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.set('view engine', 'ejs');
app.set('views', 'views');

// csrf token generate
app.use(csrfProtection);

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoute);

// error page
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URL)
  .then((result) => {
    console.log('MongoDB Connected !');
    app.listen(PORT, () => {
      console.log(`server is running on port : ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
