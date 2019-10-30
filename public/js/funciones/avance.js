import Swal from 'sweetalert2';

export const actualizarAvance = () => {
    
    // Seleccionar tareas existentes
    const tareas = document.querySelectorAll('li.tarea');

    if(tareas.length > 0) {

        // Seleccionar las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo')

        // Clcular el avance
         
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);


        // mostrar el avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%';

        if(avance === 100) {
            Swal.fire(
                'Completaste el proyecto',
                'Felicidades haz terminado tus tareas',
                'success'
            )
      }
   }
}