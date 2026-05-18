import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { Cartas } from './serviciosMayorMenor/cartas';
import Swal from 'sweetalert2';
import { ResultadosService } from '../../servicios/resultados-service';


@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css',
})
export class MayorMenor implements OnInit {
  constructor(private cartaService: Cartas,
              private cd: ChangeDetectorRef,
              private router: Router,
              private auth: AuthService,
              private resultadosService: ResultadosService){}

    jugando: boolean = false;
    cartasAcertadas: string[] = [];
    cartasErradas: string[] = [];
    vidas: number = 3;
    puntos: number = 0;
    gano: boolean = false;
    cartaActual: any;
    cartaSiguiente: any;
    deckId: string = '';
    cartasRestantes: number = 52;
    cargando: boolean = true;
    eleccionJugador: string = '' 
    mostrarNuevaCarta: boolean = false;
    tiempoInicio: number = 0;
    tiempoFinal: number = 0;
    tiempoTotal: number = 0;

    ngOnInit(): void {
    this.mostrarReglas()
    this.iniciarJuego()
    }

    iniciarJuego(){
      this.tiempoInicio = Date.now()
      this.crearMazo()
    }

    reiniciarJuego() {
      this.jugando = true;
      this.deckId = '';
      this.vidas = 3;
      this.puntos = 0;
      this.gano = false;
      this.iniciarJuego();
      this.cd.detectChanges();
      }

    crearMazo() {
      this.cartaService.traerMazo().subscribe((respuesta)=>{
          this.deckId = respuesta.deck_id
          console.log("DECK ID:" + this.deckId);
          this.sacarCarta()
        })
    }

    sacarCarta(){
      this.cargando = false
      console.log("usando deck:", this.deckId);

      this.cartaService.darCarta(this.deckId).subscribe((respuesta) => {
      this.cartaActual = respuesta.cards[0]

      console.log("CARTA ACTUAL ", this.cartaActual)
        
      this.cd.detectChanges();
      })
    }

    mostrarCarta(){
      this.cartaService.darCarta(this.deckId).subscribe((respuesta)=>{

      this.cartaSiguiente = respuesta.cards[0];
      console.log("CARTA NUEVA: ", this.cartaSiguiente)
      
      
        this.mostrarNuevaCarta = true;
  
            
      let valorActual = this.obtenerValor(this.cartaActual);
      let valorNueva = this.obtenerValor(this.cartaSiguiente);
      
      if(this.eleccionJugador == 'mayor' && valorNueva > valorActual){
        this.puntos++;
        this.cartasAcertadas.push(this.cartaSiguiente.code);
      }
      else if(this.eleccionJugador == 'menor' && valorNueva < valorActual){
        this.puntos++;
        this.cartasAcertadas.push(this.cartaSiguiente.code);
      }
      else if(this.eleccionJugador == 'igual' && valorNueva == valorActual){
        this.puntos += 2;
        this.cartasAcertadas.push(this.cartaSiguiente.code);
      }
      else {
        this.vidas--;
        this.cartasErradas.push(this.cartaSiguiente.code)

      }

      this.verificarVictoria()


      setTimeout(()=>{
        this.cartaActual = this.cartaSiguiente;
        this.cartaSiguiente = null;
        this.mostrarNuevaCarta = false;
        this.eleccionJugador = '';
        this.cd.detectChanges();

      }, 2000);

   })
  }

  obtenerValor(carta: any): number {

    if(!carta?.value){
    return 0;
  }
    switch(carta.value){
      case 'ACE':
        return 1;

      case 'KING':
      case 'QUEEN':
      case 'JACK':
        return 10;

      default:
        return Number(carta.value);
    }
  }

  elegirMayor(){
    console.log("eligio mayor")
    this.eleccionJugador = 'mayor';
  }

  elegirMenor(){
    console.log("eligio menor")
    this.eleccionJugador = 'menor';
  }
  
  elegirIgual(){
    console.log("eligio igual")
    this.eleccionJugador = 'igual';
  }

  verificarVictoria(){
    if(this.vidas === 0){
      this.jugando = false
      this.gano = false
      this.guardarPartida();

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
                
    } else if(this.puntos === 5){
      this.jugando = false
      this.gano = false
      this.guardarPartida()

      Swal.fire({
            title: '¡Felicitaciones!',
            text: 'Ganaste la partida',
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
  }

  obtenerUsuario(){
    return this.auth.getUser().nombre
  }

  obtenerCantidadCartasAcertadas(){
    return this.cartasAcertadas.length
  }

  obtenerCantidadCartasErradas(){
    return this.cartasErradas.length
  }

  obtenerTiempoTotal(){
      const milisegundos = this.tiempoFinal - this.tiempoInicio;
      return `${Math.floor(milisegundos / 1000)} segundos` ;
    }

  async guardarPartida(){
    this.tiempoFinal = Date.now();
    const juego = "Mayor o Menor"
    const usuario = this.obtenerUsuario();
    const cantidadCartasAdivinadas = this.obtenerCantidadCartasAcertadas();
    const cantidadCartasErradas = this.obtenerCantidadCartasErradas()
    const tiempoTranscurrido = this.obtenerTiempoTotal()
    const fecha = new Date();

    await this.resultadosService.guardarDatosPartida(juego,usuario,this.gano,cantidadCartasAdivinadas, cantidadCartasErradas, this.puntos, this.vidas, tiempoTranscurrido, fecha)
    console.log("Partida guardada")
  }

  hayPartidaActiva(): boolean {
      return this.jugando;
    }

 
  volverAJuegos(){
    this.router.navigate(['./home'])
  }


  mostrarReglas() {
      Swal.fire({
        title: '¿Cómo jugar a Mayor/Menor?',
        html: `
        <p>Tenes que adivinar si la próxima carta será mayor o menor.</p>
        <p>¡Ojo! Cada error resta 1 vida.</p>
        <p>Si acertas sumas puntos.</p>
 
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

}
