const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	//cositas de los inmuebles como objeto
	email: { 
        type: String, 
        required: true, 
        unique: true
    },
	nombre: { type: String},
	password: { type: String, required: true},
	phone:  { type: String},
	publicaciones : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inmueble'}],
	resume: { type: String},
	clients :[{ type: mongoose.Schema.Types.ObjectId, ref: 'Cliente'}],
	friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inmueble'}],
	role: { type: String, default: "agent"}
	
	//Extras
	//solicitudes[]
	//url foto de perfil
});

module.exports = mongoose.model('User', userSchema);