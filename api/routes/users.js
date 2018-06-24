const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Inmueble = require('../models/inmueble');
const User = require('../models/user');
const ObjectId = require('mongodb').ObjectID;


//Handle get request ALLUSERS
router.get('/', (req, res, next) => {
    User.find()
        .select('_id email nombre password phone')
        .exec()
        .then(docs => {
            const response = {
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
router.post('/', (req, res, next) => {
    const usuario = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        nombre: req.body.nombre,
        password: req.body.password,
        phone: req.body.phone

    });
    usuario.save()
        .then(result => {
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

/**
 * @param  {ruta de usuari oespecifico}
 * @param  {requerimientos respuestas y otros}
 * @return {null}
 */
router.delete('/:userID', (req, res, next) => {
    res.status(200).json({
        message: 'Usuario Eliminado',
        userID: req.params.userID
    });
});


//Get user individual
/**
 * Devuelve los usuarios de manera especifica e inividual
 * @param  {Url} '/:userID' id del usuario
 * @param  {promise} (req,      res,          next [description]
 * @return {null}            [description]
 */
router.get('/:userID', (req, res, next) => {
    const id = req.params.userID;
    User.findById(id)
        .select('_id email nombre password phone publicaciones')
        .exec()
        .then(doc => {
            console.log(" Desde la DB ", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404)
                    .json({ message: "No valid id" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


//Cambios sobre un usuario 
/**
 * @param  {url}
 * @param  {Promesa}
 * @return {null}
 */
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
                    url: 'http://localhost:3000/users/' + id // esto podria ser dinamico
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


//get de inmuebles de usuarios
/**
 * devuelve la cantidad de publicaciones de un user y sus publicaciones
 * @param  {url} '/:userID/publicaciones' url de publicaciones de cada usuario
 * @param  {[type]} (req,                    res,          next [description]
 * @return {[type]}                          [description]
 */
router.get('/:userID/publicaciones', (req, res, next) => {
    const id = req.params.userID;
    User.findById(id)
        .select('publicaciones')
        .populate('publicaciones'/*,'name'*/)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                	count: doc.publicaciones.length,
                	publicaciones: doc.publicaciones,
                });
            } else {
                res.status(404)
                    .json({ message: "No valid route" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });


});


// post into an array of objects of a url still whit problems

/**
 * @param  {enlace}
 * @param  {peticion}
 * @return {null}
 */
router.post('/:userID/publicaciones', (req, res, next) => {
    const id = req.params.userID;
    const idinmueble = req.body.idinmueble;
    User.update({ _id: id }, { $push: { "publicaciones": ObjectId(idinmueble)} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User inserted inmuebles',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/users/' + id // esto podria ser dinamico
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