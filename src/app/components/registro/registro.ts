import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuariosService } from '../../servicios/usuario.service';
import { usuarioExisteAsyncValidator } from '../../validators/usuario.validator';
import { confirmarClaveValidator } from '../../validators/clave.validator';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})

export class Registro implements OnInit {

  miRegistro!: FormGroup;  // contiene todos los formControl

  constructor(private usuariosService: UsuariosService, private fb: FormBuilder) {} 
  
  ngOnInit(): void {
      this.miRegistro = this.fb.group({

        usuario: ["", {
            validators: [Validators.required,
              Validators.minLength(4)
            ],
            asyncValidators: usuarioExisteAsyncValidator(this.usuariosService),
            updateOn: 'blur'
        }],
        nombre: ["", [Validators.required, Validators.pattern('^[a-zA-Z]+$')]], 
        edad: ["", [Validators.required, Validators.min(10), Validators.max(99)]],
        mail: ["", [Validators.required, Validators.email]],
        clave: ["", [Validators.required, Validators.minLength(6)]],
        repiteClave: [null, Validators.required]

      }, { validators: confirmarClaveValidator() });

       this.miRegistro.valueChanges.subscribe((valor) => { // Me subscribo al form y reacciono cada vez que cambie el valor
          console.log("El formulario ha cambiado", valor);
    });
  }

  // geters para obtener los controles y acceder al formulario html
  get usuario() {
    return this.miRegistro.get('usuario');
  }
  get nombre() {
    return this.miRegistro.get('nombre');
  }
  get edad() {
    return this.miRegistro.get('edad');
  }
  get mail() {
    return this.miRegistro.get('mail');
  }
  get clave() {
    return this.miRegistro.get('clave');
  }
  get repiteClave() {
    return this.miRegistro.get('repiteClave');
  }

  enviarForm() {

    this.miRegistro.markAllAsTouched();
    console.log("Intento de envío");

    if (this.miRegistro.invalid) { // invalid: devuelve válido o inválido
      console.log("Formulario inválido");
      return;
    }
    console.log("Envio exitoso");
  }

  resetearForm() {
    this.miRegistro.reset(); // método para reseteo
  }
}

