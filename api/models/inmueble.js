const mongoose = require('mongoose');

const inmuebleSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	//cositas de los inmuebles como objeto
	name: String,
	surface: Number,
	typePub: String,
	privacy: String,
	Address: String,
	Observaciones: String,
	propertytype: String

});

module.exports = mongoose.model('Inmueble', inmuebleSchema);