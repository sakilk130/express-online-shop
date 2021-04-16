const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const shopRoutes = require('./routes/shop.js');
const adminRoutes = require('./routes/admin.js');
const { static } = require('express');
const PORT = process.env.PORT || 4000;
const errorController = require('./controllers/error');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// error page
app.use(errorController.get404);

// server start
app.listen(PORT, () => {
  console.log(`server is running on port : ${PORT}`);
});
