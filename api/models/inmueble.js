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
	inmueblesimg: { type: String, required: true}
	//coordenadas[] google maps supongo
	// Agente capturador


});

module.exports = mongoose.model('Inmueble', inmuebleSchema);