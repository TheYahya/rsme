var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

var User = require('../models/user');

const PASS_ERR = 'Short password! minimum 8 char.';

router.get('/', function(req, res){
	res.end('user');
});

router.get('/sign-up', function(req, res){
	if(req.session.email){
		res.location('/');
		res.redirect('/');
		return;
	}
	res.render('user/sign-up', {title: 'Sign up'});
});

router.post('/sign-up', function(req, res, next){
	var email = req.body.email;
	var password = req.body.password;


	req.checkBody('email', 'Invalid Email!').isEmail();
	req.checkBody('password', PASS_ERR).isLength({min: 8});

	var errors = req.validationErrors();

	console.log(errors);

	if(errors){
		res.render('user/sign-up', {
			errors: errors,
			email: email
		});
		return;
	}

	User.getUserByEmail(email, function(err, user){
		if(err) throw err;
		if(user){
			var errors = [];
			errors.push({msg:"Email exists"});
			res.render('user/sign-up', {
			errors: errors,
			email: email
		});
			return;
		}
		var newUser = new User({
				email: email,
				password: bcrypt.hashSync(password, 10)
			});

			User.createUser(newUser, function(err, user){
				if(err) throw err;

				User.getUserByEmail(email, function(err, user){
					User.updateUsernameByEmail(user.email, user._id, function(err){

						res.render('user/sign-in', {msgSuccess: 'Registered successful, please sign in.'});
					});
				});

			});
	});
});


router.get('/sign-in', function(req, res){
	if(req.session.email){
		res.location('/');
		res.redirect('/');
		return;
	}
	res.render('user/sign-in', {title: 'Sign in'});
});

router.post('/sign-in', function(req, res, next){
	var email = req.body.email;
	var password = req.body.password;


	req.checkBody('email', 'Invalid Email!').isEmail();
	req.checkBody('password', PASS_ERR).isLength({min: 8});

	var errors = req.validationErrors();

	console.log(errors);

	if(errors){
		res.render('user/sign-in', {
			errors: errors,
			email: email
		});
		return;
	}

	User.getUserByEmail(email, function(err, user){
		console.log(user);
		if(!user){
			var errors = [];
			errors.push({msg:'Email and password does not match!'});
			res.render('user/sign-in', {
				errors: errors,
				email: email
			});
			return;
		} else {
			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					req.session.email = user.email;
					res.location('/');
					res.redirect('/');
				}else{
					var errors = [];
					errors.push({msg:'Email and password does not match!'});
					res.render('user/sign-in', {
						errors: errors,
						email: email
					});
					return;
				}
			});
		}
	});
});

router.get('/edit', function(req, res){
	res.location('/');
	res.redirect('/');
});


router.post('/edit', function(req, res){
	if(req.session.email === undefined){
		res.status(401);
		res.end(JSON.stringify({"ok":false}));
		return;
	}

	var email 				= req.body.email;
	var username 			= req.body.username;
	var fullname 			= req.body.fullname;
	var age 					= req.body.age;
	var bio  					= req.body.bio;
	var website 			= {
		title: req.body.websiteTitle,
		url: req.body.websiteUrl
	};
	var emails 				= req.body.emails;
	var numbers				= req.body.numbers;
	var skills 				= req.body.skills;


	var newUser = {
		username: username,
		fullname: fullname,
		age: age,
		bio: bio,
		website: website,
		emails: emails,
		numbers: numbers,
		skills: skills
	};

	console.log(JSON.stringify(newUser));
	User.updateUserByEmail(email, newUser, function(err){
		if(err) throw err;
		res.end(JSON.stringify({"ok":true}));
	});
	//res.end(JSON.stringify(req.body.skills));
});


router.get('/logout', function(req, res){
	req.session.destroy(function(err){
		if(err) throw err;
		res.redirect('/');
	});
});
module.exports = router;
