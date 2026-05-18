import { Component, Input } from '@angular/core';
import { Resultado } from '../../modelos/resultado';


@Component({
  selector: 'app-tabla-resultados',
  imports: [],
  templateUrl: './tabla-resultados.html',
  styleUrl: './tabla-resultados.css',
})
export class TablaResultados {

  @Input() resultados: Resultado[] = [];

}
