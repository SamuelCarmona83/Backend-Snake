const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const User = require('../models/user');

//Handle get request ALLUSERS
router.get('/', (req, res, next) => {
	User.find()
	.select('_id email nombre password phone')
	.exec()
	.then(docs => {
		const response= {
			count: docs.length,
			users: docs

		};
		//if(docs.length >= 0){
			res.status(200).json(response);
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
			message: 'Usuario creado con exito',
			createdUser: {
				_id: result._id,
				nombre: result.nombre,
				email: result.email,
				phone: result.phone
			}
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
	.select('_id email nombre password phone')
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


//Cambios sobre un usuario 
router.patch('/:userID', (req, res, next) => {
  const id = req.params.userID;
  const updateOps = {};
  for (const ops of Array.from(req.body)) {
    updateOps[ops.propName] = ops.value;
  }
  User.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'User updated',
          request: {
          		type: 'GET',
          		url: 'http://localhost:3000/users/'+id // esto podria ser dinamico
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;