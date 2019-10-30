// importar el modelo
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');




exports.proyectosHome = async (req, res) => {


    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});

    res.render('home',{
        nombrePagina : 'proyectos',
        proyectos 
    });
}

exports.formularioProyecto = async (req, res) => {
   
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    
    res.render('nuevo_proyecto',{
       nombrePagina : 'nuevo proyecto' ,
       proyectos
    });
}

exports.nuevoProyecto = async(req, res) => {
    //enviar a la consola lo que el usuario escriba
    //console.log(req.body);

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});

    // validar que tengamos algo en el input
    const {nombre} = req.body;// destrutctury

   

    let errores = [];

    if(!nombre) {
       
        errores.push({'texto': 'Agrega un nombre al proyecto'});
    }

    //si hay errores
    if (errores.length) {
        res.render('nuevo_proyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {

        // no hay errores insertar en la db
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({nombre, usuarioId });
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res, next) =>{

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}});

    const proyectoPromise =  Proyectos.findOne({
        where:{
            url: req.params.url,
            usuarioId
        }
    });//hacemos una consulta

    //array destructury
    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);
        
        //consultar tareas del proyecto actual
        const tareas = await Tareas.findAll({
            where: {
                proyectoId : proyecto.id
            },
            // include: [
            //     { model: Proyectos}
            // ]
        })

       

        if (!proyecto) return next();
            
       // render a la vista
       res.render('tareas',{
           nombrePagina: 'Tareas del proyecto',
           proyecto,
           proyectos,
           tareas
       });

}

exports.formularioEditar = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}});

    const proyectoPromise =  Proyectos.findOne({
        where:{
            id: req.params.id,
            usuarioId
        }
    });//hacemos una consulta

    //array destructury
    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);





    //render a la vista
    res.render('nuevo_proyecto',{
        nombrePagina:'Editar Proyecto',
        proyectos,
        proyecto
    })
}


exports.actualizarProyecto = async(req, res) => {
    //enviar a la consola lo que el usuario escriba
    //console.log(req.body);

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});

    // validar que tengamos algo en el input
    const {nombre} = req.body;// destrutctury

    let errores = [];

    if(!nombre) {
        errores.push({'texto': 'Agrega un nombre al proyecto'});
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevo_proyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    } else{

        // no hay errores actualizar en la db
       await Proyectos.update(
           { nombre: nombre },
           { where: { id: req.params.id} }
         );
        res.redirect('/');
    }
}


// Nota !  sequelize esta basado en promises

// los hocks corren una funcion en determinado tiempo

exports.eliminarProyecto = async (req, res, next) => {
   // req, query o params
    //console.log(req.query);
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: { url : urlProyecto}});

    if(!resultado){
        return next();
    }
    
    res.status(200).send('proyecto eliminado correctamente')
}