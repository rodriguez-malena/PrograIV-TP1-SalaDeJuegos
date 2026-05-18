import { Component, Input } from '@angular/core';
import { Resultado } from '../../modelos/resultado';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-resultados',
  imports: [CommonModule],
  templateUrl: './tabla-resultados.html',
  styleUrl: './tabla-resultados.css',
})
export class TablaResultados {

  @Input() resultados: Resultado[] = [];

}
