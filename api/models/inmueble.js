const mongoose = require('mongoose');

const inmuebleSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	//cositas de los inmuebles como objeto
	name: { type: String, required: true},
	surface: { type: String, required: true},
	typePub: { type: String, required: true},
	privacy: { type: String, required: true},
	Address: { type: String, required: true},
	Observaciones: { type: String, required: true},
	propertytype: { type: String, required: true}
	//fotos[]
	//coordenadas[] google maps supongo
	// Agente capturador


});

module.exports = mongoose.model('Inmueble', inmuebleSchema);