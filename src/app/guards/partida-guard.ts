import { CanDeactivateFn } from '@angular/router';
import Swal from 'sweetalert2';


export const partidaGuard: CanDeactivateFn<any> = (component) => {


  if(!component.hayPartidaActiva()){
    return true
  } else {
    
    return Swal.fire({
           title: '¿Estas seguro de abandonar la partida?',
           icon: 'question',
           confirmButtonText: 'SI',
           showCancelButton: true,
           cancelButtonText: 'NO',
   
           customClass: {
             confirmButton: 'btn-propio',
             popup: 'mi-modal',
             title: 'mi-titulo',
             cancelButton:'btn-propio'
           }
   
   
      }).then((resultado) => {

    return resultado.isConfirmed;

  });
 };
  }
