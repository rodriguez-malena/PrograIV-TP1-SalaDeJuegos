import { Component } from '@angular/core';
import { AhorcadoRoutingModule } from "../../juegos/ahorcado/ahorcado-routing-module";

@Component({
  selector: 'app-home',
  imports: [AhorcadoRoutingModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
