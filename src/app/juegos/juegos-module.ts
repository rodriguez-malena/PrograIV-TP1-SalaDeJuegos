import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosRoutingModule } from './juegos-routing-module';
import { Ahorcado } from './ahorcado/ahorcado';
import { MayorMenor } from './mayor-menor/mayor-menor';
import { Preguntados } from './preguntados/preguntados';
import { ElRosco } from './el-rosco/el-rosco';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [Ahorcado, MayorMenor, Preguntados, ElRosco],
  imports: [CommonModule, JuegosRoutingModule, FormsModule],
})
export class JuegosModule {}
