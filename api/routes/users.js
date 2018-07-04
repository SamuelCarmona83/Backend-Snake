const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const Inmueble = require('../models/inmueble');
const User = require('../models/user');
const ObjectId = require('mongodb').ObjectID;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/**
 * devuelve todos los usuarios de la bd
 * @param  {url} '/'   /users
 * @param  {funcion} (req, res,          next [description]
 * @return {[type]}       response message
 */
router.get('/', (req, res, next) => {
    User.find()
        .select('_id email nombre password phone publicaciones resume favorites clients')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: {
                    docs
                        }
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
/**
 * Post de un nuevo usuario
 * @param  {url} '/'   /users
 * @param  {fuction} (req, res,          next [description]
 * @return {[type]}       response
 */	
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
 * Sign up or create user validatedad
 * @param  {url}   "/signup" [description]
 * @param  {responses} (req,     res,          next) [description]
 * @return {[type]}             [description]
 */
 router.post("/signup", (req, res, next) => {
   User.find({ email: req.body.email })
     .exec()
     .then(user => {
       if (user.length >= 1) {
         return res.status(409).json({
           message: "Mail exists"
         });
       } else {
         bcrypt.hash(req.body.password, 10, (err, hash) => {
           if (err===null) {
             return res.status(500).json({
               error: err,
               message: "Hash failed"
             });
           } else {
             const user = new User({
               _id: new mongoose.Types.ObjectId(),
               email: req.body.email,
               password: hash
             });
             user
               .save()
               .then(result => {
                 console.log(result);
                 res.status(201).json({
                   message: "User created"
                 });
               })
               .catch(err => {
                 console.log(err);
                 res.status(500).json({
                   error: err
                 });
               });
           }
         });
       }
     });
 });

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            "secret",
            {
                expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


/**
 * Elimina los usuarios 
 * @param  {url} '/:userID' usuario individual
 * @param  {fuction} (req,      res,          next [description]
 * @return {[type]}            [description]
 */
router.delete('/:userID', (req, res, next) => {
    const id = req.params.userID;
    User.remove({
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


//Get user individual
/**
 * Devuelve los usuarios de manera especifica e inividual
 * @param  {Url} '/:userID' id del usuario
 * @param  {function} (req,      res,          next [description]
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
 * @param  {function}
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
 * @param  {function} (req,                    res,          next [description]
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
 * Agrega un nuevo inmueble a un usuario
 * @param  {url} '/:userID/publicaciones' post
 * @param  {function} (req,                    res,          next [description]
 * @return {response}                          message
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