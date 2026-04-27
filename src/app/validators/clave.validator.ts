import { ValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";

export function confirmarClaveValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        

      const claveControl = formGroup.get('clave'); // get recibe un string que representa el nombre de uno de los formControl que contiene el grupo
      const repiteClaveControl = formGroup.get('repiteClave'); // clave y repite clave son los inputs no sus valores
      const respuestaError = { noCoincide: 'La clave no coincide' }; // hago mi respuesta de error, el validationError 

      if (claveControl?.value !== repiteClaveControl?.value) { // si el valor de clave no coincide con el valor de repite
        formGroup.get('repiteClave')?.setErrors(respuestaError);  // sertErrors inserta manualmente el error
        // Si los campos de contraseña no coinciden, devolvemos un error de validación
        return respuestaError;

      } else {
        formGroup.get('repiteClave')?.setErrors(null); // inserto null para limpiar 
        // Si los campos de contraseña coinciden, la validación es correcta
        return null;
      } 
    };
  }