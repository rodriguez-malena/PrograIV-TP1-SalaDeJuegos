import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ahorcado } from './ahorcado/ahorcado';
import { MayorMenor } from './mayor-menor/mayor-menor';
import { partidaGuard } from '../guards/partida-guard';

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
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuegosRoutingModule {}
