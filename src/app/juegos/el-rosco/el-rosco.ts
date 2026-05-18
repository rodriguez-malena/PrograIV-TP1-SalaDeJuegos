import { Component, OnInit, OnDestroy } from '@angular/core';
import { PreguntasService } from './preguntas-service';
import { AuthService } from '../../servicios/auth.service';
import { ResultadosService } from '../../servicios/resultados-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PreguntaRosco } from './pregunta-rosco';

@Component({
  selector: 'app-el-rosco',
  standalone: false,
  templateUrl: './el-rosco.html',
  styleUrl: './el-rosco.css',
})
export class ElRosco implements OnInit, OnDestroy{

  constructor(private preguntasService: PreguntasService,
              private resultadosService: ResultadosService,
              private auth: AuthService,
              private router: Router){}
  
  preguntasRosco: PreguntaRosco[] = [];
  palabrasAdivinadas: string[] = [];
  palabrasErradas: string[] = []
  vidas: number = 6;
  cantidadErrores: number = 0;
  jugando: boolean = false;
  gano: boolean = false;
  tiempoInicio: number = 0;
  tiempoActual: number = 0;
  intervalo: any;
  tiempoLimite: number = 200;
  puntaje: number = 0;
  radio: number = 230;
  centroX: number = 300;
  centroY: number = 300;
  indiceActual: number = 0;
  preguntaActual!: PreguntaRosco ;
  respuestaUsuario: string = '';


  ngOnInit(): void {
    this.mostrarReglas()
    this.iniciarJuego()
  }


  iniciarJuego(){
    this.jugando = true;
    this.obtenerPreguntas()
  }
  
  reiniciarJuego() {
    this.preguntasRosco = [];
    this.palabrasAdivinadas = [];
    this.palabrasErradas = []
    this.cantidadErrores = 0;
    this.vidas = 6;
    this.gano = false;
    this.puntaje = 0;
    this.indiceActual = 0;
    this.respuestaUsuario = '';
    this.tiempoActual = 0;
    this.iniciarJuego();
  }
  
  obtenerPreguntas() {
    this.iniciarTemporizador();

    this.preguntasService.traerPreguntas().subscribe((respuesta) => {
      this.preguntasRosco = respuesta;
      this.preguntaActual = this.preguntasRosco[this.indiceActual];
    })
  }


  verificarRespuesta(){
    if(this.respuestaUsuario.trim().toUpperCase() === this.preguntaActual.respuesta){

      this.preguntaActual.estado = "correcta";
      this.puntaje += 2;
      this.palabrasAdivinadas.push(this.preguntaActual.respuesta)
    

    } else {
      this.preguntaActual.estado = "incorrecta";
      this.vidas--;
      this.cantidadErrores++;

      if(this.vidas === 0){
        this.gano = false;
        this.finalizarJuego()
        return;
      }
    }
    
    if(this.jugando){
      this.pasarSiguientePregunta()
    }
  }


  pasapalabra(){
    this.preguntaActual.estado = "pasada";
    this.pasarSiguientePregunta()
  }
  

  pasarSiguientePregunta() {

    if(!this.verPendientes()){
      return;
    };

    do {
      this.indiceActual++;

      if(this.indiceActual >= this.preguntasRosco.length){
        this.indiceActual = 0;
      }

    } while (this.preguntasRosco[this.indiceActual].estado === "correcta" || this.preguntasRosco[this.indiceActual].estado === "incorrecta")

      this.preguntaActual = this.preguntasRosco[this.indiceActual];

      this.respuestaUsuario = '';
  }

  verPendientes(){
    const quedanPendientes = this.preguntasRosco.some(pregunta => pregunta.estado === 'pendiente'|| pregunta.estado === 'pasada');
    if(!quedanPendientes){
      this.gano = true
      this.finalizarJuego();
      return false;
      }
    return true
  }

  finalizarJuego(){
    this.jugando = false;  
    clearInterval(this.intervalo);  
    this.guardarPartida()
    Swal.fire({
        title: this.gano ? 'Felicidades' : 'Perdiste',
        text: this.gano ? `Completaste el rosco con un puntaje de ${this.puntaje}` : `Te quedaste sin vidas`,
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

  obtenerPosicionX(indice: number): number {
    const angulo = (2 * Math.PI * indice) / this.preguntasRosco.length;

    return this.centroX + this.radio * Math.cos(angulo - Math.PI / 2);
  }

  obtenerPosicionY(indice: number): number {
    const angulo = (2 * Math.PI * indice) / this.preguntasRosco.length;

    return this.centroY + this.radio * Math.sin(angulo - Math.PI / 2);
  }

  iniciarTemporizador(){  
      this.tiempoInicio = Date.now();

      this.intervalo = setInterval(() => {
  
        this.tiempoActual = Math.floor(
          (Date.now() - this.tiempoInicio) / 1000);

        if (!this.jugando) {
          clearInterval(this.intervalo);
          return;
        }

        if(this.tiempoActual >= this.tiempoLimite){
          this.jugando = false;
          this.gano = false;
          clearInterval(this.intervalo);
    
          Swal.fire({
                title: 'Perdiste',
                text: `Te quedaste sin tiempo!`,
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
        },1000)
    }

  mostrarReglas() {
      Swal.fire({
        title: '¿Cómo jugar al Rosco?',
        html: `
        <p>Deberás adivinar la palabra oculta en cada letra del abecedario</p>
        <p>¡Ojo! El tiempo corre y cada error suma un intento fallido.</p>
        <p>Ganás si descubrís las palabras antes de quedarte sin tiempo.</p>
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
      clearInterval(this.intervalo);
      this.jugando = false;
      this.router.navigate(['/home'])
    }

  obtenerUsuario(){
    return this.auth.getUser().nombre
  }

  async guardarPartida(){
    const juego = "El Rosco"
    const tiempoTotal = `${this.tiempoActual} segundos`  
    const usuario = this.obtenerUsuario();
    const palabrasAcertadas = this.palabrasAdivinadas.length;
    const fecha = new Date();

    await this.resultadosService.guardarDatosPartida(juego,usuario,this.gano,palabrasAcertadas, this.cantidadErrores, this.puntaje, this.vidas, tiempoTotal, fecha)
    console.log("Partida guardada")
  }


  hayPartidaActiva(): boolean {
    return this.jugando;
    }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
    this.jugando = false;
  }


}
