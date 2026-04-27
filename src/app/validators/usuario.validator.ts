import { UsuariosService } from "../servicios/usuario.service";
import { AsyncValidatorFn } from "@angular/forms";
import { AbstractControl } from "@angular/forms";
import { map } from "rxjs";


export function usuarioExisteAsyncValidator(usuariosService: UsuariosService): AsyncValidatorFn  {
    return (control: AbstractControl) => { // control representa al input 
      const usuario = control.value; // .value extrae el valor del input y se asigna a usuario
      return usuariosService.traerUsuarios(usuario) // devuelve una lista de usuarios
      .pipe( // pipe es el intercepta la comunicación entre el observable y el que esta escuchando
        map(usuarios => { /* Con map obtenemos el valor en tráfico 
          antes de que se lo pase al observable.
          Chequeamos si ese array tiene un usuario, si lo tiene devuelve un 
          validationError(objeto clave valor) y sino nulo
        */
          if (usuarios.length > 0) {
            return { usuarioExiste: 'El usuario ya existe' };
          } 
          return null;
        })
      );
    };
  }