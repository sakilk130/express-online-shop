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
const flash = require('connect-flash');

const MONGODB_URL =
  'mongodb+srv://admin:OSLG4FkU6AaIRWpF@cluster0.jmdlh.mongodb.net/express-online-shop?retryWrites=true&w=majority';

const MongoDBStore = new MongoSessionStore({
  uri: MONGODB_URL,
  collection: 'sessions',
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

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

// csrf token generate
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoute);

// error page
app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render('500', {
    docTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URL)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`server is running on port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
