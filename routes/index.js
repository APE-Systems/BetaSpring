


module.exports = function(app) {

  // Home
  app.get('/', function(req, res) {

    res.render('splash', {
      school: "texas tech"
    });
  });

};

//enter *splash* in render section above when creating my spash page

/*

Public
Routes
Index
Views
	includes
		head
		nav
		footer
	login
	splash.jade








app.get('/', function(req, res) {
	
})











*/
