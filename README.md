# Backend
Backend Suburbuy - Sistemas de Informacion

# Enlace al Deploy
https://apirest-suburbuy.herokuapp.com/

# Local Mode

1)Correr npm i

2)luego para iniciar el servidor npm start

# Enlace al Deploy
https://apirest-suburbuy.herokuapp.com/

# Datos de interes

https://apirest-suburbuy.herokuapp.com/users


https://apirest-suburbuy.herokuapp.com/users/id

# JSON de Users

	{
		"email": "email",
		"nombre": "nombre",
		"password": "password",
		"phone":  "0X1X-000-00-00"
	}

# JSON patch USers

	[
	{"propName": "nombre", "value":"new name"},
	{"propName": "email", "value":"new email"},
	{"propName": "password", "value":"new password"},
	{"propName": "phone", "value":"new phone"}
	]

https://apirest-suburbuy.herokuapp.com/inmuebles
# JSON de Inmuebles
	{
		"name": "Nombre de la Publicacion",
		"surface": 200,
		"typePub": 2,
		"privacy": "public/private/friends",
		"address": "Direccion",
		"observaciones": "Si es fea o bonita",
		"propertytype": "Casa/Apartamento/Terreno",
		"inmueblesimg": "path"
	}

# Imagen de un inmueble
https://apirest-suburbuy.herokuapp.com/uploads/


# Inmuebles de los Users
https://apirest-suburbuy.herokuapp.com/users/ID/publicaciones

	{	"count":2,
		"publicaciones":
	[{"_id":"id","name":"name","price":200,"__v":0},
	 {"_id":"id2","name":"name2","__v":0,"price":300
	}]
	}

