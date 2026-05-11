import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { PartidaService } from '../services-ahorcado/partida-service';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-ahorcado-component',
  standalone: false,
  templateUrl: './ahorcado-component.html',
  styleUrl: './ahorcado-component.css',
})

export class AhorcadoComponent implements OnInit {
    constructor(private router:Router, 
                private cdr: ChangeDetectorRef,
                private partida: PartidaService,
                private auth: AuthService){}

    abecedario: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", 
      "T", "U", "V", "W", "X", "Y", "Z"];
    palabras: string[] = ['ANGULAR', 'COMPONENTE','SERVICIO','STANDALONE','DIRECTIVA','MODULO']
    palabraSeleccionada: string = '';
    letrasAdivinadas : string[] = [];
    letrasIncorrectas :  string[] = [];
    palabrasAdivinadas:  string[] = [];
    erroresPermitidos: number = 6;
    cantidadErrores: number = 0;
    jugando: boolean = false
    tiempoInicio: number = 0;
    tiempoFinal: number = 0;
    tiempoTotal: number = 0;
    cantidadLetras: number = 0;
    resultado: string = '';
    usarPista: boolean = false;


  darPista(){
    this.usarPista = true;
      for (let letra of this.palabraSeleccionada) {
        if (!this.letrasAdivinadas.includes(letra)) {
          this.letrasAdivinadas.push(letra);
          break;
        }
      }
    }

    obtenerUsuario(){
      return this.auth.getUser().nombre
    }

    obtenerTiempoTotal(){
      const milisegundos = this.tiempoFinal - this.tiempoInicio;
      return `${Math.floor(milisegundos / 1000)} segundos` ;
    }

    obtenerCantidadLetras(){
      return this.letrasAdivinadas.length + this.letrasIncorrectas.length
    }

    obtenerErrores(){
      return this.cantidadErrores
    }


    esCorrecta(letra:string) {
      return this.letrasAdivinadas.includes(letra)
      }

    esIncorrecta(letra:string) {
      return this.letrasIncorrectas.includes(letra)
      }


   verificarVictoria() {
      for (let letra of this.palabraSeleccionada) {
        if(!this.letrasAdivinadas.includes(letra)){
          return
        }
      } 
      this.jugando = false;
      this.resultado = "Ganó partida";
      this.guardarPartida();
      
      Swal.fire({
      title: '¡Felicitaciones!',
      text: 'Adivinaste la palabra correctamente',
      icon: 'success',
      confirmButtonText: 'Jugar otra vez',
      showCancelButton: true,
      cancelButtonText: 'Volver al menú',
      allowOutsideClick: false,

      customClass: {
        confirmButton: 'btn-propio',
        popup: 'mi-modal',
        title: 'mi-titulo',
        cancelButton: 'btn-propio'
      }

    }).then((resultado) => {

      if (resultado.isConfirmed) {
        this.reiniciarJuego();
      }

      if (resultado.dismiss === Swal.DismissReason.cancel) {
        this.volverAJuegos()
      }
    });
   }

   verificarDerrota(){
     if(this.cantidadErrores === this.erroresPermitidos){
        this.jugando = false;
        this.resultado = "Perdió partida"
        this.guardarPartida();

        Swal.fire({
          title: 'Perdiste',
          text: `La palabra era: ${this.palabraSeleccionada}`,
          icon: 'error',
          confirmButtonText: 'Jugar otra vez',
          showCancelButton: true,
          cancelButtonText: 'Volver al menú',
          allowOutsideClick: false,

          customClass: {
            confirmButton: 'btn-propio',
            popup: 'mi-modal',
            title: 'mi-titulo',
            cancelButton:'btn-propio'
          }

      }).then((resultado) => {

        if (resultado.isConfirmed) {
          this.reiniciarJuego();
        }

        if (resultado.dismiss === Swal.DismissReason.cancel) {
          this.volverAJuegos()
        }
      });
  }
}

    reiniciarJuego() {
      this.iniciarJuego();
      this.cdr.detectChanges();
      }
    
    
    iniciarJuego(){
      this.letrasAdivinadas= []
      this.letrasIncorrectas= []
      this.cantidadErrores= 0
      
      this.tiempoInicio = Date.now()
      console.log("inicio " + this.tiempoInicio)
      const palabraRandom = Math.floor(Math.random() * this.palabras.length);
      this.palabraSeleccionada = this.palabras[palabraRandom];
      console.log(`Palabra: ${this.palabraSeleccionada}`);
      
    }
    
    seleccionarLetra(letra:string){
      this.jugando = true
      
      console.log("Presionó la letra " + letra)
      if(this.palabraSeleccionada.includes(letra) ){
        this.letrasAdivinadas.push(letra);
        this.verificarVictoria();
        
      } else {
        this.letrasIncorrectas.push(letra)
        this.cantidadErrores += 1
        this.verificarDerrota()
      }
    }
    
    mostrarReglas() {
      Swal.fire({
        title: '¿Cómo jugar al Ahorcado?',
        html: `
        <p>Tenes que adivinar la palabra oculta letra por letra.</p>
        <p>¡Ojo! Cada error suma un intento fallido.</p>
        <p>Ganás si descubrís todas las letras antes de quedarte sin intentos.</p>
        `,
        icon: 'info',
        confirmButtonText: 'Empezar',
        allowOutsideClick: false,
        customClass: {
          confirmButton: 'btn-propio',
          popup: 'mi-modal',
          title: 'mi-titulo',                    
        }
      });  
    }
    
    ngOnInit(): void {
      this.mostrarReglas()
      this.iniciarJuego()
    }
    
    hayPartidaActiva(): boolean {
      return this.jugando;
    }

    volverAJuegos() {
      this.router.navigate(['/home'])
    }

    async guardarPartida(){
      this.tiempoFinal = Date.now();
      console.log("fin " + this.tiempoFinal)

      const usuario = this.obtenerUsuario();
      const resultadoFinal = this.resultado;
      const tiempoTranscurrido = this.obtenerTiempoTotal();
      const letrasUsadas = this.obtenerCantidadLetras();
      const erroresObtenidos = this.obtenerErrores();

      await this.partida.guardarDatosPartidaAhorcado(usuario, resultadoFinal, tiempoTranscurrido, letrasUsadas, erroresObtenidos)
      console.log("Partida guardada")
    }

    
}
