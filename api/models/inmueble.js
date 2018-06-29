const mongoose = require('mongoose');

const inmuebleSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	//cositas de los inmuebles como objeto
	nombre: { type: String, required: true},
	surface: { type: String, required: true},
	typePub: { type: String, required: true},
	privacy: { type: String, required: true},
	address: { type: String, required: true},
	observaciones: { type: String, required: true},
	propertytype: { type: String, required: true},
	inmueblesimg: { type: String, required: true},
	latitude: {type: Number, required: true},
	longitude: {type: Number, required: true},
	price: {type: Number, required: true},
	sold: {type: Boolean, default: false},
	date: { type: Date }
	//deberia existir numero de publicacion o algo que permita validar 

	
});

module.exports = mongoose.model('Inmueble', inmuebleSchema);