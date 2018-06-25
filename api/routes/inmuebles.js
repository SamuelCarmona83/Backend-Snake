const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const Inmueble = require('../models/inmueble');
//const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null,  new Date().toISOString().replace(/:/g, '-')+file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});



//General get inmuebles como vector
router.get('/', (req, res, next) => {
	Inmueble.find()
	.exec()
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

router.post('/', upload.single('inmueblesimg') ,(req, res, next) => {
	//estructura del objeto inmueble o algo asi

	const inmueble = new Inmueble({
		_id: new mongoose.Types.ObjectId(),
		nombre: req.body.nombre,
		surface: req.body.surface,
		typePub: req.body.typePub,
		privacy: req.body.privacy,
		address: req.body.address,
		observaciones: req.body.observaciones,
		propertytype: req.body.propertytype,
		inmueblesimg: req.file.path

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