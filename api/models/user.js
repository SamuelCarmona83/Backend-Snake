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
		posicion:  [Number],
		enemigosmuertos: { type: Number},
		inventario: { type: String},
		gameobject: { type: String},
		escena: { type: String},
		vida: {type: Number},
		daño: {type: Number},
		dañoactual: {type: Number}
	

	//posicion 2 float
	//contador enemigos muertos int
	//inventario string
	//Gameobject string
	//escena actual string
	//vida actual int
	//daño int
	//daño actual int

});

module.exports = mongoose.model('User', userSchema);