var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var fs = require('fs');

var mongodbUrl = process.env.MONGODB_URL;
mongoose.connect(mongodbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected');
});


var UserSchema = mongoose.Schema({
	email:{type:String},
	username:{type:String},
	password:{type:String},
	fullname:{type:String},
	age:{type: Number},
	bio:{type:String},
	website:{
		title:{type:String},
		url:{type:String}
	},
	numbers:[{
		title:{type:String},
		value:{type:String}
	}],
	emails:[{
		title:{type:String},
		value:{type:String}
	}],
	skills:[{
		title:{type:String},
		level:{type:Number, min:1, max:10}
	}],
	portfolio:[{
		title:{type:String},
		details:{type:String},
		link:{type:String}
	}],
	education:[{
		field:{type:String},
		degree:{type:String},
		details:{type:String}
	}],
	languages:[{
		title:{type:String},
		level:{type:Number, min:1, max:10}
	}],
	interests:[String]
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
		newUser.save(callback);
}

module.exports.getUserByEmail = function(email, callback){
	User.findOne({email: email}, callback);
}

module.exports.getUserByUsername = function(username, callback){
	User.findOne({username: username}, callback);
}

module.exports.comparePassword = function(thePassword, hash, callback){
  if (bcrypt.compareSync(thePassword, hash)) {
    callback(null, true);
  }
	callback(null, false);
}

module.exports.updateUsernameByEmail = function(email, newUsername, callback){
	User.update({email: email}, {username: newUsername}, {}, callback);
}

module.exports.updateUserByEmail = function(email, newUser, callback){
	User.update({email: email}, {
		username: newUser.username,
		fullname: newUser.fullname,
		age: newUser.age,
		bio: newUser.bio,
		website: newUser.website,
		emails: newUser.emails,
		numbers: newUser.numbers,
		skills: newUser.skills
	}, {}, callback);
}
