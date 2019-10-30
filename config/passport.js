const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


// Referencia al modelo a autenticar
const Usuarios = require('../models/Usuarios');

// local strategy - Login con credenciales propias

passport.use(
    new LocalStrategy(
        //por default passport espera un usuario y password
        {
            usernameField: 'email',// estos campos deben ser los mismos que hay en el modelo
            passwordField: 'password'
       },
        // aqui se procesa la entrada
       async (email, password, done) => {
        try {
            const usuario = await Usuarios.findOne({
                where: {
                    email,
                    activo:1
                }
            });

            // El usuario existe pero el pasword no es correcto
            if (!usuario.verificarPassword(password)) {
                return done(null, false, {
                    message :'password Incorrecto'
                });
            }

           

         

            // El email existe y el password es correcto
            return done(null,usuario);

        } catch (error) {
            // ese usuario no existe
            return done(null, false, {
                message :'Esa cuenta no existe'
            })
        }
       }
    )
);


// Serializar el usuario 
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});


// Exportar
module.exports = passport;


