exports.get404 = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split('=')[1] == 'true';
  res.status(404).render('404', {
    docTitle: '404 Page Not Found',
    path: '/404',
    isAuthenticated: isLoggedIn,
  });
};
