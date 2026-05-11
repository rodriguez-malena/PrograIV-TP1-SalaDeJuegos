import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MayorMenorComponent } from './mayor-menor-component/mayor-menor-component';
import { partidaGuard } from '../../guards/partida-guard';

const routes: Routes = [
  {
    path:'',
    component: MayorMenorComponent,
    canDeactivate: [partidaGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MayorMenorRoutingModule {}
