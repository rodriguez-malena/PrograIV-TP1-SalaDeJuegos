import { UsuariosService } from "../servicios/usuario.service";
import { AsyncValidatorFn } from "@angular/forms";
import { AbstractControl } from "@angular/forms";
import { map } from "rxjs";


export function usuarioExisteAsyncValidator(usuariosService: UsuariosService): AsyncValidatorFn  {
    return (control: AbstractControl) => { 
      const usuario = control.value;
      return usuariosService.traerUsuarios(usuario) 
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
  export function usuarioNoExisteAsyncValidator(usuariosService: UsuariosService): AsyncValidatorFn {

  return (control: AbstractControl) => {

    const usuario = control.value;

    return usuariosService.traerUsuarios(usuario).pipe(
      map(usuarios => {

        if (usuarios.length === 0) {
          return { usuarioNoExiste: 'Usuario no encontrado' };
        }

        return null;
      })
    );
  };
}