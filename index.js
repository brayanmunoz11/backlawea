//Importamos el dotenv para las variables de entorno
require('dotenv').config()
//Se usa para poder usar las variables de entorno
//Se declara la express
const express = require('express')
//Para poder usar el framework de express
//Se crean las opciones de cors
let corsOptions = {
  //Se declara el origin 
  origin: '*' // Compliant
};
//Para detectar por donde se usa la api
//Se importa el helmet
let helmet = require("helmet");
//Para la proteccion de la apio
//Se crea la app de express
let app = express(); // Compliant
//Se crea una instancia de express
//Se usa el helmet
app.use(helmet.hidePoweredBy());
//SU uso nos permite mejorar
//Se importa el cors
const cors = require('cors')
//Para manejar el uso de la api
//Se usa el cors
app.use(cors(corsOptions))
//Para manejar las opciones
//Se usan las urlencoded
app.use(express.urlencoded({extended: true, limit: "8mb"}));
//Se usa el json
app.use(express.json())


//Importamos la ruta users
const links = require('./routes/links')




//Se usa la ruta login
app.use(links)
//Se usa la ruta users
app.get('/', (req, res) => {
  //Resopuesta a la peticion
  res.status(200).json({
    gawr: 'gura'
  })
})

const PORT = process.env.PORT || 3001
//Condicional para el testing
if (process.env.NODE_ENV !== 'test') {
  //Se crea el escuchador
  app.listen(PORT, () => {
    //console del localhost
    console.log(`La api esta en http://localhost:${PORT}`);
  })

}
//Se exporta la app
module.exports = { app }




