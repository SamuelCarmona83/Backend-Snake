const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	//cositas de los inmuebles como objeto
	email: { type: String, required: true},
	nombre: { type: String, required: true},
	password: { type: String, required: true},
	phone:  { type: String, required: true},
	publicaciones : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inmueble'}]
	//clientes[]
	//solicitudes[]
	//Amigos[]
	//url foto de perfil
	//ventas[]
	//Marcas de Favorito[]
});

module.exports = mongoose.model('User', userSchema);