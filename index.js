const express = require('express');
const routes = require('./routes');
const path = require('path');//para leer el file system
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//  importar variables.env
require('dotenv').config({path: 'variables.env'}); 

//helpers con algunas funciones
const helpers = require('./helpers');

//crear la conexion a la base de datos
const db = require('./config/db');
//authenticate solo se conecta al servidor sync hace consultas

// importando los modelos
 require ('./models/Proyectos');
 require ('./models/Tareas');
 require ('./models/Usuarios');

 // Creamos la base de datos

db.sync()
    .then(() => console.log('conectado al servidor'))
    .catch( error => console.log(error));

//creando la app de express
const app = express();

//donde cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar pug
app.set('view engine','pug');


// habilitar body parser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

app.use(expressValidator());




//añadir carpeta a las vistas
app.set('views',path.join(__dirname, './views'));



// Agregar flash messages
app.use(flash());


app.use(cookieParser());




// Nos permite navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());






// variables super globales
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump; 
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    console.log(res.locals.usuario);
    next();//garantizamos que pase al siguiente midelware
});







app.use('/', routes() );


// servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 4000;


app.listen(port, host, () => {
    console.log('El servidor esta en funcionamiento');
});


//app.use se ejecuta en todos los verbos http