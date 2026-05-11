import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  miLogin!: FormGroup

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router) {} 

  ngOnInit(): void {
    this.miLogin = this.fb.group({
      email: ["",[Validators.required, Validators.email]],
      clave: ["",[Validators.required, Validators.minLength(6)]]
    })
  };

    get clave() {
    return this.miLogin.get('clave');
    }

    get email() {
      return this.miLogin.get('email')
    }

  async enviarForm() {

    this.miLogin.markAllAsTouched();
    console.log("Intento de envío");

    if (this.miLogin.invalid) { 
      console.log("Formulario inválido");
      return;
    }
    console.log("Envio exitoso");

    const { email, clave } = this.miLogin.value;

    try {

      const respuesta = await this.auth.iniciarSesion(email, clave);
      console.log("Usuario validado:", respuesta);

      
      this.router.navigate(['/home']);
      
      
    } catch (error: any) {
    
            if (error.code === 'auth/invalid-credential') {
    
              Swal.fire({
                icon: 'error',
                title: 'Usuario inexistente',
                text: 'Este correo no está registrado',
                customClass: {
                    confirmButton: 'btn-propio',
                    popup: 'mi-modal',
                    title: 'mi-titulo',                    
                }
              });

            }}}

    volverARegistro(){
        this.router.navigate(['/registro'])
    }

    autocompletarYEnviar(email: string, clave: string) {
      this.miLogin.patchValue({
        email: email,
        clave: clave
      });

      this.enviarForm();
    }

    
  }

