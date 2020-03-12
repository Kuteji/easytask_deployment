const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const enviarEmail = require('../handlers/email');
//importamos los operadores de sequelize 
const Op = Sequelize.Op;






exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});


// funcion para revisar si el usuario esta logueado o no

exports.usuarioAutenticado = (req, res, next) => {

    // si el usuario esta autenticado, adelante
    if(req.isAuthenticated()) {
        return next();
    }

    // si no esta autenticado,  redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

// Funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}


// genera un token si elusuario es valido
exports.enviarToken = async (req, res) => {
    // verificar que el usuario existe
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: {email}});

    // si no existe el usuario

    if(!usuario) {
        req.flash('error', 'La cuenta ingresada no existe!');
        res.redirect('/reestablecer');
    }

    //usuario existe generamos el token
     usuario.token = crypto.randomBytes(20).toString('hex');
     usuario.expiracion = Date.now() + 3600000;

     // guardando en la db
    await  usuario.save();
    
    // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    
    // Envia el correo con el token

    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    }).catch(console.error);

    // Terminar
    req.flash('correcto','Hemos enviado un correo para restablecer tu contraseña')
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    // si no encuentra el usuario
    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    // formulario para reestablecer el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    });
    
}

// Cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {

    // Verifica el token valido pero tambien la fecha de expiracion
     const usuario = await Usuarios.findOne({
         where: {
             token: req.params.token,
             expiracion: {
                [Op.gte] : Date.now()
             }
         }
     })

     // verificamos si el usuario existe
     if(!usuario) {
         req.flash('error', 'No valido');
         res.redirect('/reestablecer')
     }



     // hashear el password

     usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );
     usuario.token = null;
     usuario.expiracion = null;
     
     //guardamos
     await usuario.save();

     req.flash('correcto', 'Tu password se ha modificado correctamente');
     res.redirect('/iniciar-sesion');

}