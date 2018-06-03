const express = require('express');
const router = express.Router();


//Handle get request
router.get('/', (req, res, next)=> {
	res.status(200).json({
		message: 'Recibiendo petecion de Usuarios'
	});
});


router.post('/', (req, res, next)=> {
	const usuario = {
		userID: req.body.userID,
		password: req.body.password
	};
	res.status(201).json({
		message: 'Usuario creado',
		usuario: usuario
		
	});
});


router.delete('/:userID', (req, res, next)=> {
	res.status(200).json({
		message: 'Usuario Eliminado',
		userID: req.params.userID
	});
});

router.get('/:userID', (req, res, next)=> {
	res.status(200).json({
		message: 'Usuario detallado',
		userID: req.params.userID
	});
});

module.exports = router;