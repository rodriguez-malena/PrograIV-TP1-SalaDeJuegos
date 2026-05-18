import { Component } from '@angular/core';
import { JuegosRoutingModule } from "../../juegos/juegos-routing-module";

@Component({
  selector: 'app-error',
  imports: [JuegosRoutingModule],
  templateUrl: './error.html',
  styleUrl: './error.css',
})
export class Error {}
