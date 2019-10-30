// instalamos babel para poder tener la sintaxis de  import en lugar de require

import proyectos from './modulos/proyectos';
import tareas from './modulos/tareas';
import {actualizarAvance} from './funciones/avance';


document.addEventListener('DOMContentLoaded', () => {
    actualizarAvance();
});