const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            isEmail: {
                msg : 'Agrega un correo valido'
            },
            notEmpty: {
                msg: 'El E-mail no puede ir vacio'
            }
        },
        unique: {
           args: true,
           msg: 'Usuario Ya Registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacio'
            }
        }
    },
    activo:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token:Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
           usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10) );
        }
    }

});

//metodos personalizados

//prototipe inserta funciones en los objetos
Usuarios.prototype.verificarPassword = function(password) {  
 return bcrypt.compareSync(password, this.password);
}

// Creando la llave foranea usuario id para Proyectos
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;