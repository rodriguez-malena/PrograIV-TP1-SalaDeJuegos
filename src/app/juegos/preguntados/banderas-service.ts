import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pais } from './pais';

const API_BANDERAS = "https://restcountries.com/v3.1/all?fields=name,flags"

@Injectable({
  providedIn: 'root',
})
export class BanderasService {
  
  constructor(private http : HttpClient){}

  obtenerBanderas(){
    return this.http.get<Pais[]>(API_BANDERAS)
  }
}
