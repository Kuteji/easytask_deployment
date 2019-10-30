import Swal from 'sweetalert2';
import axios from 'axios';


const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
btnEliminar.addEventListener('click', e => {
    const urlProyecto = e.target.dataset.proyectoUrl;
    //console.log(urlProyecto);


    Swal.fire({
        title: 'Estas seguro?',
        text: "No podras revertirlo !",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si , borrar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
           //enviar peticion a axios 
            const url = `${location.origin}/proyectos/${urlProyecto}`;
            
            //enviar peticion para borrar
            axios.delete(url,{ params: {urlProyecto} })
                .then(function(respuesta){
                    console.log(respuesta)

                    Swal.fire(
                      'Proyecto Eliminado!',
                      respuesta.data,
                      'success'
                    );
          
                    // Redireccionar al inicio
                    setTimeout(() => {
                          window.location.href = '/';
                    },3000);
                })
                .catch(() => {
                    Swal.fire({
                      type:'error',
                      title:'Hubo un error',
                      text: 'No se pudo eliminar el proyecto'
                  })
                })

               

          
        }
      })
});

}

export default btnEliminar;