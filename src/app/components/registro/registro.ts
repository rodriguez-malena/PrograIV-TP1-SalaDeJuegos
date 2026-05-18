import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { confirmarClaveValidator } from '../../validators/clave.validator';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import  Swal from 'sweetalert2'


@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})

export class Registro implements OnInit {

  miRegistro!: FormGroup;  

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router) {} 
  
  ngOnInit(): void {
      this.miRegistro = this.fb.group({

        nombre: ["", [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.minLength(4), Validators.maxLength(10)]], 
        apellido: ["", [Validators.required, Validators.pattern('^[a-zA-Z]+$'),  Validators.minLength(4), Validators.maxLength(10)]],
        edad: ["", [Validators.required, Validators.min(10), Validators.max(99)]],
        email: ["", [Validators.required, Validators.email, Validators.maxLength(30)]],
        clave: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
        repiteClave: [null, Validators.required]

      }, { validators: confirmarClaveValidator() });

       this.miRegistro.valueChanges.subscribe((valor) => { 
          console.log("El formulario ha cambiado", valor);
    });
  }

  get nombre() {
    return this.miRegistro.get('nombre');
  }
  get apellido() {
    return this.miRegistro.get('apellido');
  }
  get edad() {
    return this.miRegistro.get('edad');
  }
  get email() {
    return this.miRegistro.get('email');
  }
  get clave() {
    return this.miRegistro.get('clave');
  }
  get repiteClave() {
    return this.miRegistro.get('repiteClave');
  }

  async enviarForm() {

    this.miRegistro.markAllAsTouched();
    console.log("Intento de envío");

    if (this.miRegistro.invalid) { 
      console.log("Formulario inválido");
      return;
    }
    console.log("Envio exitoso");

    const { email, clave, nombre, apellido, edad } = this.miRegistro.value;

    try {

      const respuesta = await this.auth.registrar(email, clave);
      console.log("Usuario creado:", respuesta);

      await this.auth.guardarDatosUsuario(respuesta.user.uid, email, nombre, apellido, edad);

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Usuario creado correctamente',
        customClass: {
                confirmButton: 'btn-propio',
                popup: 'mi-modal',
                title: 'mi-titulo',
            }
          
      });

      this.router.navigate(['/login']);

    } catch (error: any) {

        if (error.code === 'auth/email-already-in-use') {

          Swal.fire({
            icon: 'error',
            title: 'Usuario existente',
            text: 'Este correo ya está registrado',
            customClass: {
                confirmButton: 'btn-propio',
                popup: 'mi-modal',
                title: 'mi-titulo',
            }
          });

        } else {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo completar el registro'
          });

  }}}

    resetearForm() {
      this.miRegistro.reset(); 
    }

    irALogin(){
      this.router.navigate(['/login'])
    }

    volverAInicio(){
      this.router.navigate(['/bienvenida'])
    }
  }

