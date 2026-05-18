import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ahorcado } from './ahorcado/ahorcado';
import { MayorMenor } from './mayor-menor/mayor-menor';
import { partidaGuard } from '../guards/partida-guard';
import { Preguntados } from './preguntados/preguntados';
import { ElRosco } from './el-rosco/el-rosco';

const routes: Routes = [
  {
    path: 'ahorcado', 
    component: Ahorcado,
    canDeactivate: [partidaGuard]
  },
  {
    path: 'mayor-menor', 
    component: MayorMenor,
    canDeactivate: [partidaGuard]
  },
  {
    path: 'preguntados',
    component: Preguntados,
    canDeactivate: [partidaGuard]
  },
  {
    path: 'el-rosco',
    component: ElRosco,
    canDeactivate: [partidaGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuegosRoutingModule {}
