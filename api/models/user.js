const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	//cositas de los inmuebles como objeto
	email: String,
	name: String,
	password: String,
	phone:  String

});

module.exports = mongoose.model('User', userSchema);