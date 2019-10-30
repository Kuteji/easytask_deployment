const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


exports.agregarTarea = async (req, res, next) => {
    // Obtenemos proyecto actual
    const proyecto = await Proyectos.findOne({where: { url: req.params.url }});

    // leer el valor del input
    const {tarea} = req.body;

    //estado 0 = incompleto y ID de proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    // Insertar en la Base de datos
    const resultado = await Tareas.create({ tarea, estado, proyectoId});


    if (!resultado) {
        return next();
    }

    // Redireccionar
    res.redirect(`/proyectos/${req.params.url }`);
}

exports.cambiarEstadoTarea = async (req, res, next) => {
    const { id } = req.params;

    console.log(`este es el log: ${id}`);
    const tarea = await Tareas.findOne({where: {id} });
    
    //cambiar el estado 
    let estado = 0;
    if(tarea.estado === estado) {
        estado = 1;
    } 
    tarea.estado = estado;
    

    const resultado = await tarea.save();// Guardando el estado en la db
   
    if(!resultado) return next();

    

    res.status(200).send('Actualizado');
}

//con patch req.query no funciona utilizar params

//params nos devuelve lo que hay en la url
//query nos devuelve lo que pasemos como parametro

exports.eliminarTarea = async (req, res) => {
    
    const { id } = req.params;

    // Elimonar la tarea
    const resultado = await Tareas.destroy({where: { id }});

    if(!resultado) return next();
    
    res.status(200).send('Tarea Eliminada');
}