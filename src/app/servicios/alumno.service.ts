
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlumnoResponse } from '../modelos/alumno-response';

const API_URL = "https://api.github.com/users/rodriguez-malena";

@Injectable({
  providedIn: 'root',
})

export class AlumnoService {

  constructor(private http: HttpClient){}

  obtenerAlumno(){
      return this.http.get<AlumnoResponse>(API_URL);
  }
}
