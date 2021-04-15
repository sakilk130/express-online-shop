const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const RootDir = require('./utill/path.js');
const shopRoutes = require('./routes/shop.js');
const adminRoutes = require('./routes/admin.js');
const { static } = require('express');
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', adminRoutes.router);
app.use(shopRoutes);

// error page
app.use((req, res, next) => {
  res.status(404).render('404', { docTitle: '404 Page Not Found' });
});

// server start
app.listen(PORT, () => {
  console.log(`server is running on port : ${PORT}`);
});
