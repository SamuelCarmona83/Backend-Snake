const mongoose = require('mongoose');

const inmuebleSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	//cositas de los inmuebles como objeto
	name: String,
	price: Number

});

module.exports = mongoose.model('Inmueble', inmuebleSchema);