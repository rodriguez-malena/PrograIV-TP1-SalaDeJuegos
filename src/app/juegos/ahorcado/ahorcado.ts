import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import Swal from 'sweetalert2';
import { ResultadosService } from '../../servicios/resultados-service';


@Component({
  selector: 'app-ahorcado',
  standalone: false,
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado implements OnInit{

  constructor(private router:Router, 
                private cdr: ChangeDetectorRef,
                private resultadosService: ResultadosService,
                private auth: AuthService){}

    abecedario: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", 
      "T", "U", "V", "W", "X", "Y", "Z"];
    palabras: string[] = ['ANGULAR', 'COMPONENTE','SERVICIO','STANDALONE','DIRECTIVA','MODULO','FRAMEWORK']
    palabraSeleccionada: string = '';
    letrasAdivinadas : string[] = [];
    letrasIncorrectas :  string[] = [];
    palabrasAdivinadas:  string[] = [];
    palabrasUsadas: string[] = [];
    erroresPermitidos: number = 6;
    cantidadErrores: number = 0;
    erroresTotales: number = 0;
    jugando: boolean = false;
    tiempoInicio: number = 0;
    tiempoFinal: number = 0;
    tiempoTotal: number = 0;
    cantidadLetras: number = 0;
    gano: boolean = false;
    usarPista: boolean = false;
    puntaje: number = 0;
    rondaActual: number = 1;
    maximoRondas: number = 7;
    vidasTotales: number = 3;
    

    ngOnInit(): void {
      this.mostrarReglas()
      this.iniciarJuego()
    }
    
    iniciarJuego(){
      this.tiempoInicio = Date.now()
      this.iniciarRonda()
      
    }

    iniciarRonda(){
      this.letrasAdivinadas = []
      this.letrasIncorrectas = []
      this.cantidadErrores = 0
      this.usarPista = false

      const palabrasDisponibles = this.palabras.filter(palabra => !this.palabrasUsadas.includes(palabra));

      const palabraRandom = Math.floor(Math.random() * palabrasDisponibles.length);

      this.palabraSeleccionada = palabrasDisponibles[palabraRandom];
      console.log(this.palabraSeleccionada)
      
      this.palabrasUsadas.push(this.palabraSeleccionada);
    }
    
    reiniciarJuego() {
      this.palabrasUsadas = []
      this.cantidadErrores = 0
      this.erroresTotales = 0
      this.puntaje = 0
      this.rondaActual = 1
      this.vidasTotales = 3
      this.gano = false
      this.iniciarJuego();
      this.cdr.detectChanges();
      }
    

    seleccionarLetra(letra:string){
      this.jugando = true
      
      console.log("Presionó la letra " + letra)

      if(this.palabraSeleccionada.includes(letra) ){
        this.letrasAdivinadas.push(letra);
        this.verificarVictoria();
        
      } else {
        this.letrasIncorrectas.push(letra)
        this.cantidadErrores++
        this.erroresTotales++
        this.verificarDerrota()
      }
    }

    darPista(){
      this.usarPista = true;
        for (let letra of this.palabraSeleccionada) {
          if (!this.letrasAdivinadas.includes(letra)) {
            this.letrasAdivinadas.push(letra);
            break;
          }
        }
    }

    hayPartidaActiva(): boolean {
      return this.jugando;
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

      this.puntaje += 10;
      this.palabrasAdivinadas.push(this.palabraSeleccionada)
      
      if(this.rondaActual >= this.maximoRondas){
        this.gano = true
        this.finalizarPartida()

      } else {

        this.rondaActual++;

            Swal.fire({
              title: '¡Correcto!',
              text: 'Pasas a la siguiente ronda',
              icon: 'success',
              timer: 1200,
              showConfirmButton: false
            });

        this.iniciarRonda();
      }
    } 


   verificarDerrota(){
     if(this.cantidadErrores === this.erroresPermitidos){
        this.vidasTotales --;

        if(this.vidasTotales == 0){
          this.gano = false;
          this.finalizarPartida()
        }
        else {

          if(this.rondaActual >= this.maximoRondas){
            this.gano = false;
            this.finalizarPartida()
          }
          this.rondaActual++

              Swal.fire({
                title: 'Perdiste esta ronda y una vida!',
                text: `La palabra era ${this.palabraSeleccionada}`,
                icon: 'warning',
                timer: 1500,
                showConfirmButton: false
            });
          this.iniciarRonda()
        }
     }}

    finalizarPartida(){
      this.jugando = false;
      this.guardarPartida();

       Swal.fire({
          title: this.gano ? 'Ganaste' : 'Perdiste',
          text: this.gano ? 'Completaste todas las rondas' : `Te quedaste sin vidas`,
          icon: this.gano ? 'success' :'error',
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
    

    volverAJuegos() {
      this.router.navigate(['/home'])
    }

    obtenerUsuario(){
      return this.auth.getUser().nombre
    }

    obtenerTiempoTotal(){
      const milisegundos = this.tiempoFinal - this.tiempoInicio;
      return `${Math.floor(milisegundos / 1000)} segundos` ;
    }



    async guardarPartida(){
      this.tiempoFinal = Date.now();
      console.log("fin " + this.tiempoFinal)
      const juego = "Ahorcado"
      const usuario = this.obtenerUsuario();
      const tiempoTranscurrido = this.obtenerTiempoTotal();
      const palabrasAcertadas = this.palabrasAdivinadas.length
      const fecha = new Date();

      await this.resultadosService.guardarDatosPartida(juego, usuario, this.gano, palabrasAcertadas, this.cantidadErrores, this.puntaje, this.vidasTotales, tiempoTranscurrido, fecha)
      console.log("Partida guardada")
      }

      
}


