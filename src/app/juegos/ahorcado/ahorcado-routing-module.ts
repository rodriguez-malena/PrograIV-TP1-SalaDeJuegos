import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from './ahorcado-component/ahorcado-component';
import { partidaGuard } from '../../guards/partida-guard';

const routes: Routes = [
    {
      path: '',
      component: AhorcadoComponent,
      canDeactivate: [partidaGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AhorcadoRoutingModule {
  
}
