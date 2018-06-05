const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');




const Inmueble = require('../models/inmueble');

//General get inmuebles como vector
router.get('/', (req, res, next) => {
	Inmueble.find().exec()
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

//Peticion de Publicacion de inmueble // funcionando

router.post('/', (req, res, next) => {
	//estructura del objeto inmueble o algo asi
	
	const inmueble = new Inmueble({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		surface: req.body.surface,
		typePub: req.body.typePub,
		privacy: req.body.privacy,
		address: req.body.address,
		observaciones: req.body.observaciones,
		propertytype: req.body.propertytype

	});
	inmueble.save()
	.then(result=>{
		console.log(result);
		res.status(201).json({
			message: 'Recibiendo POST request a /inmuebles',
			createdInmueble: result
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		})
	});

	

});


//prueba del get kinf of
router.get('/:inmuebleID', (req, res, next)=>{
	const id = req.params.inmuebleID;
	Inmueble.findById(id)
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


router.patch('/:inmuebleID', (req, res, next)=>{
	const id = req.params.inmuebleID;
	//Cambios dinamicos sobre cualquier objeto
	const updateOps= {};
	for(const ops of req.body){
		updateOps[ops.propName]=ops.value;
	}
	Inmueble.update({_id: id},{$set: updateOps})
	.exec()
	.then(result=>{
		res.status(200).json(result)
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});

});


//Eliminar error "code": 72,
//"errmsg": "Cannot use (or request) retryable writes with limit=0"
router.delete('/:inmuebleID', (req, res, next)=>{
	const id = req.params.inmuebleID;
	Inmueble.remove({
		_id: id
	})
	.exec()
	.then( result => {
		res.status(200).json(result);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});

});

module.exports = router;