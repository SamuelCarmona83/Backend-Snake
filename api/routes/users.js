const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const User = require('../models/user');

//Handle get request ALLUSERS
router.get('/', (req, res, next) => {
	User.find().exec()
	.then(docs => {
		console.log(docs);
		//if(docs.length >= 0){
			res.status(200).json(docs);
		//}else{
		//	res.status(404).json({
		//		message: 'No entries Found'
		//	});
		//}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

//POST USER individual
router.post('/', (req, res, next)=> {
	const usuario = new User({
		_id: new mongoose.Types.ObjectId(),
		email: req.body.email,
		nombre: req.body.nombre,
		password: req.body.password,
		phone: req.body.phone

	});
	usuario.save()
	.then(result=>{
		console.log(result);
		res.status(201).json({
			message: 'Recibiendo POST request a /users',
			createdUser: result
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		})
	});
});


router.delete('/:userID', (req, res, next)=> {
	res.status(200).json({
		message: 'Usuario Eliminado',
		userID: req.params.userID
	});
});


//Get user individual
router.get('/:userID', (req, res, next)=>{
	const id = req.params.userID;
	User.findById(id)
	.exec()
	.then(doc => {
		console.log(" Desde la DB ", doc);
		if(doc){
			res.status(200).json(doc);
		}
		else{
			res.status(404)
			.json({message: "No valid id"});
		}
	})
	.catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;