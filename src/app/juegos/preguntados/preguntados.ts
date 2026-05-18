import { Component, OnInit, signal } from '@angular/core';
import { BanderasService } from './banderas-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Pais } from './pais';
import { ResultadosService } from '../../servicios/resultados-service';
import { AuthService } from '../../servicios/auth.service';



@Component({
  selector: 'app-preguntados',
  standalone: false,
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class Preguntados implements OnInit {

  jugando: boolean = false;
  gano: boolean = false;
  puntaje: number = 0;
  vidas: number = 3;
  respuestasCorrectas: string[] = [];
  cantidadErrores: number = 0;
  paises = signal<Pais[]>([]);
  paisCorrecto = signal<any | null>(null);
  opcionesPaises = signal<string[]>([]);
  opcionSeleccionada: string = '';
  respondio: boolean = false;
  tiempoInicio: number = 0;
  tiempoActual: number = 0;
  intervalo: any;
  tiempoLimite: number = 60;

  constructor(private banderasService: BanderasService,
              private router: Router,
              private resultadosService: ResultadosService,
              private authService: AuthService){}

  ngOnInit(): void {
    this.mostrarReglas()
    this.iniciarJuego()
  }

  iniciarJuego(){
    this.cargarBanderas();
    this.iniciarTemporizador();
  }

  reiniciarJuego(){
    this.vidas = 3
    this.puntaje = 0
    this.cantidadErrores = 0
    this.respuestasCorrectas = []
    this.opcionSeleccionada = '';
    this.respondio = false;
    this.gano = false
    this.iniciarJuego()
  }

  cargarBanderas(){
    this.jugando = true
    this.banderasService.obtenerBanderas().subscribe((respuesta) => {
        this.paises.set(respuesta);
        this.generarOpciones()
    })
  }

  generarOpciones(){
    const listaPaises = this.paises();

    const paisesDisponibles = listaPaises.filter(pais =>
      !this.respuestasCorrectas.includes(pais.name.common));

    const correcto = paisesDisponibles[Math.floor(Math.random() * paisesDisponibles.length)]
    this.paisCorrecto.set(correcto)

    const opciones = [correcto.name.common]

    while(opciones.length < 4){
      const paisRandom = listaPaises[Math.floor(Math.random() * listaPaises.length)];

      const nombrePais = paisRandom.name.common;

      if(!opciones.includes(nombrePais)){
        opciones.push(nombrePais)
      }
    }

     this.opcionesPaises.set(
      opciones.sort(() => Math.random() - 0.5)
    );
  
  }

  analizarRespuesta(paisElegido : string){
    this.respondio = true;
    this.opcionSeleccionada = paisElegido;

    if(paisElegido === this.paisCorrecto()?.name.common){
      this.puntaje++
      this.respuestasCorrectas.push(paisElegido)
    } else {
      this.vidas--
      this.cantidadErrores++
    }
    
    this.verificarVictoria();

    setTimeout(() => {

      if(this.jugando){

        this.respondio = false;
        this.opcionSeleccionada = '';

        this.generarOpciones();
      }

  }, 1000);
  }

  esCorrecta(opcion : string){
    return this.respondio && opcion === this.paisCorrecto()?.name.common;
  }

  esIncorrecta(opcion : string){
    return this.respondio &&
          opcion === this.opcionSeleccionada && opcion !== this.paisCorrecto()?.name.common;
  }

  verificarVictoria(){
    if(this.puntaje === 10){
      this.jugando = false;
      this.gano = true;
      this.guardarPartida()
      clearInterval(this.intervalo);

       Swal.fire({
              title: '¡Felicitaciones!',
              text: 'Ganaste el preguntados',
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

    } else if(this.vidas === 0){

      this.jugando = false;
      this.gano = false;
      this.guardarPartida()
      clearInterval(this.intervalo);
      Swal.fire({
                    title: 'Perdiste',
                    text: `Te quedaste sin vidas!`,
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

  iniciarTemporizador(){
    clearInterval(this.intervalo);

    this.tiempoInicio = Date.now();
    this.intervalo = setInterval(() => {

    this.tiempoActual = Math.floor(
      (Date.now() - this.tiempoInicio) / 1000
    );
      if(this.tiempoActual >= this.tiempoLimite){

        this.jugando = false;
        this.gano = false;
        this.guardarPartida();
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

  volverAJuegos(){
    this.router.navigate(['./home'])
  }

  mostrarReglas() {
        Swal.fire({
          title: '¿Cómo jugar al preguntados?',
          html: `
          <p>Tenes que acertar aque pais pertenece la bandera.</p>
          <p>¡Ojo! Cada error resta 1 vida y tenes 1 minuto para responder</p>
          <p>Para ganar debes llegar a 10 puntos.</p>
  
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

    obtenerUsuario(){
      return this.authService.getUser().nombre
    }

    obtenerAciertos(){
      return this.respuestasCorrectas.length
    }

  
    
    async guardarPartida(){
      const juego = "Preguntados"
      const usuario = this.obtenerUsuario();
      const aciertos = this.obtenerAciertos();
      const tiempoTotal = `${this.tiempoActual} segundos`
      const fecha = new Date();

      await this.resultadosService.guardarDatosPartida(juego, usuario, this.gano, aciertos, this.cantidadErrores, this.puntaje, this.vidas, tiempoTotal, fecha)
      console.log("Partida guardada")
    }

    hayPartidaActiva(): boolean {
      return this.jugando;
    }

  

}
