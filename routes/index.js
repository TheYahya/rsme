var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res, next) {
	var email = req.session.email;
	if(email){
		User.getUserByEmail(email, function(err, user){
			if (err) throw err;

			res.render('user/home', {
				title: 'Resume - ' + user.username,
				user: user
			});
		});
		return;
	}

	res.render('index', {
		title: 'Resume - Build your resume'
	});
});


router.get('/:username', function(req, res, next){
		username = req.params.username;
		User.getUserByUsername(username, function(err, user){
			if (err) throw err;
			if(user){
				res.render('resume_templates/r_default', {
					title:'title',
					user: user
				});
			}
			next();
		});

});




module.exports = router;
