const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const Inmueble = require('../models/inmueble');


/**
 * Funcion que almacena imagenes en la propia base de datos
 * @param  {object} req       body object
 * @param  {file} file      image
 * @param  {callback} cb)       {                         cb(null, './uploads/');  }       ruta de subida
 * @param  {function} filename: function(req, file, cb) {                          cb(null,               new Date().toISOString().replace(/:/g, '-')+file.originalname);  }} imagepath
 * @return {[type]}           [description]
 */
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null,  new Date().toISOString().replace(/:/g, '-')+file.originalname);
  }
});

/**
 * filters of images to upload
 * @param  {function}   req  peticion
 * @param  {file}   file 
 * @param  {callback} cb   callback
 * @return {[type]}        [description]
 */
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/**
 * multer method max size 5mb and filters
 * @type {configs}
 */	
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


/**
 *  get inmuebles como vector general
 * @param  {url} '/'   ruta general de inmuebles
 * @param  {function} (req, res,          next [description]
 * @return {[type]}       [description]
 */
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


/**
 * Peticion de Publicacion de inmueble // funcionando con imagen// deberia validarse de algunamanera
 * @param  {url} '/'                           POST REQUEST
 * @param  {function} upload.single('inmueblesimg') multer method for single image upload
 * @param  {function} (req,                         res,          next [description]
 * @return {[type]}                               [description]
 */
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
		inmueblesimg: req.file.path,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		price: req.body.price,
		date: Date.now 

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
/**
 * Get inmueble individual
 * @param  {url} '/:inmuebleID' ID del inmueble a devolver
 * @param  {function} (req,          res,          next [description]
 * @return {[type]}                [description]
 */
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

/**
 * UPDATE REQUEST
 * @param  {url} '/:inmuebleID' UPDATE PATCH REQUEST
 * @param  {fuction} (req,          res,          next [description]
 * @return {[type]}                [description]
 */
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


/**
 * funciona la eliminacion pero no elimina la foto
 * @param  {url} '/:inmuebleID' DELETE REQUEST
 * @param  {fuction} (req,          res,          next [description]
 * @return {response}                message and response
 */
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