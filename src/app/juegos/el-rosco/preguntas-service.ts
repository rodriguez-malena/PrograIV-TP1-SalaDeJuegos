import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PreguntaRosco } from './pregunta-rosco';


@Injectable({
  providedIn: 'root',
})
export class PreguntasService {
  constructor(private http: HttpClient){}

  traerPreguntas(){
    return this.http.get<PreguntaRosco[]>('preguntas/preguntasRosco.json')
  }
  
}
