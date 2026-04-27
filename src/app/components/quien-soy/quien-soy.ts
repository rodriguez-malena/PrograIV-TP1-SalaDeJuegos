import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../servicios/alumno.service';
import { AlumnoResponse } from '../../modelos/alumno-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quien-soy',
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy implements OnInit {

  constructor(private alumnoService : AlumnoService){}

  alumno!: AlumnoResponse;

  ngOnInit(): void {
    this.alumnoService.obtenerAlumno().subscribe(respuesta => {
        console.log("Llego:", respuesta);
        this.alumno = respuesta
    }
      )
  }
}
