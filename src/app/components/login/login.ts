import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { usuarioExisteAsyncValidator } from '../../validators/usuario.validator';
import { UsuariosService } from '../../servicios/usuario.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  miLogin!: FormGroup

  control = new FormControl('',[Validators.required, Validators.minLength(4)]);

  constructor(private usuarioService: UsuariosService, private fb: FormBuilder){};

  ngOnInit(): void {
    this.miLogin = this.fb.group({
      usuario:["",{
        validators: [Validators.required],
        asyncValidators: usuarioExisteAsyncValidator(this.usuarioService),
        updateOn:'blur'
      }],

      clave: ["",[Validators.required, Validators.minLength(6)]]
    })
  };

    get usuario() {
    return this.miLogin.get('usuario');
    }

    get clave() {
    return this.miLogin.get('clave');
  }

  enviarForm() {

    this.miLogin.markAllAsTouched();
    console.log("Intento de envío");

    if (this.miLogin.invalid) { // invalid: devuelve válido o inválido
      console.log("Formulario inválido");
      return;
    }
    console.log("Envio exitoso");
  }

  resetearForm() {
    this.miLogin.reset(); // método para reseteo
  }
}
