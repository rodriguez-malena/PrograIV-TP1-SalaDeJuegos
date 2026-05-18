import { ChangeDetectorRef, Component, OnInit, signal} from '@angular/core';
import { AlumnoService } from '../../servicios/alumno.service';
import { AlumnoResponse } from '../../modelos/alumno-response';
import { CommonModule } from '@angular/common';
import { JuegosRoutingModule } from "../../juegos/juegos-routing-module";


@Component({
  selector: 'app-quien-soy',
  imports: [CommonModule, JuegosRoutingModule],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy implements OnInit {

  constructor(private alumnoService : AlumnoService,
              private cd: ChangeDetectorRef){}
  
  alumno = signal<AlumnoResponse | null>(null);

  ngOnInit(): void {
    this.alumnoService.obtenerAlumno().subscribe(respuesta => {
        console.log("Llego:", respuesta);
        this.alumno.set(respuesta)
    }
      )
  }
}
