import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { Cartas } from './serviciosMayorMenor/cartas';
import { PartidaMayorMenor } from './serviciosMayorMenor/partida-mayor-menor';
import Swal from 'sweetalert2';


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
              private partida: PartidaMayorMenor){}

    jugando: boolean = false;
    cartasAcertadas: string[] = [];
    vidas: number = 3;
    puntos: number = 0;
    resultado: string = '';
    cartaActual: any;
    cartaSiguiente: any;
    deckId: string = '';
    cartasRestantes: number = 52;
    cargando: boolean = true;
    eleccionJugador: string = '' 
    mostrarNuevaCarta: boolean = false;

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

      setTimeout(() => {
        this.cd.detectChanges();
      }, 1000);
            
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
      this.resultado = "Perdió partida"
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
      this.resultado = "Ganó partida"
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

  obtenerCantidadCartas(){
    return this.cartasAcertadas.length
  }

  async guardarPartida(){
    const usuario = this.obtenerUsuario();
    const resultado = this.resultado;
    const cantidadCartas = this.obtenerCantidadCartas();
    const puntosObtenidos = this.puntos;
    const totalVidas = this.vidas;

    await this.partida.guardarDatosPartidaMayorMenor(usuario, resultado,cantidadCartas,puntosObtenidos, totalVidas)
    console.log("Partida guardada")
  }

  hayPartidaActiva(): boolean {
      return this.jugando;
    }

  reiniciarJuego() {
      this.iniciarJuego();
      this.cd.detectChanges();
      }
    

  iniciarJuego(){
    this.jugando = true;
    this.deckId = '';
    this.vidas = 3;
    this.puntos = 0;
    this.crearMazo()
    
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

  ngOnInit(): void {
    this.mostrarReglas()
    this.iniciarJuego()
    
  }

}
