import { Component, OnInit, signal } from '@angular/core'; 
import { ResultadosService } from '../../servicios/resultados-service';
import { Resultado } from '../../modelos/resultado';
import { TablaResultados } from '../tabla-resultados/tabla-resultados';




@Component({
  selector: 'app-resultados',
  imports: [TablaResultados],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados implements OnInit {

  constructor(private resultadoService : ResultadosService){}

  resultados = signal<Resultado[]>([]);
  resultadosAhorcado = signal<Resultado[]>([]);
  resultadosRosco= signal<Resultado[]>([]);
  resultadosPreguntados= signal<Resultado[]>([]);
  resultadosMayorMenor= signal<Resultado[]>([]);

  ngOnInit(): void {
    this.obtenerResultadoJuego()
  }

  obtenerResultadoJuego() {
    this.resultadoService.obtenerResultados("Ahorcado").subscribe((respuesta: any[]) => {
      this.resultadosAhorcado.set(respuesta);
    })

    this.resultadoService.obtenerResultados("Mayor o Menor").subscribe((respuesta: any[]) => {
      this.resultadosMayorMenor.set(respuesta);
    })

    this.resultadoService.obtenerResultados("Preguntados").subscribe((respuesta: any[]) => {
      this.resultadosPreguntados.set(respuesta);
    })

    this.resultadoService.obtenerResultados("El Rosco").subscribe((respuesta: any[]) => {
      this.resultadosRosco.set(respuesta);
    })

  }

}
