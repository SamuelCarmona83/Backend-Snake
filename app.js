const express = require('express');
const app = express();
const morgan = require('morgan');
const inmueblesRoutes = require('./api/routes/inmuebles');
const usersRoutes = require('./api/routes/users');
const bodyParser =require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');



//app.use(multer({storage: storage}).single('file'));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//admin:<PASSWORD> +process.env.MONGO_ATLAS_PW+
//PAra no forzar el codigo en el deploy
mongoose.connect('mongodb+srv://admin:admin@cluster0-9gsy8.mongodb.net/test?retryWrites=false');
mongoose.Promise = global.Promise;

//Aceso para todo el mundo y raymundo tambien supongo
app.use((req, res, next)=>{
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers",
	 "Origin,X-Requested-With, Content-Type, Accept, Authorization"
	 );
	if( req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE');
		return res.status(200).json({});
	}
	next();
});


//Rutas que manejan las peticiones
app.use('/users', usersRoutes);
app.use('/inmuebles', inmueblesRoutes);




//Mensaje de ruta invalida o algo
app.use((req, res, next)=>{
	const error= new Error('Te falta calle peluche, intenta con otra ruta.');
	error.status = 404;
	next(error);
});


app.use((error, req, res, next)=>{
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;
