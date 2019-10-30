const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');

const  Tareas = db.define('tareas',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
     },

     tarea: Sequelize.STRING(100),
     estado: Sequelize.INTEGER(1)
});

// Creamos la llave foranea para relacionar las tablas
Tareas.belongsTo(Proyectos);// cada tarea pertenece a un proyecto



// un proyecto contiene muchas tareas
//Proyectos.hasMany(Tareas)

module.exports = Tareas;