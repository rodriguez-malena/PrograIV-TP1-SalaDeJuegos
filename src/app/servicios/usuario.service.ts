
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioResponse } from '../modelos/usuario-response';

const API_URL = "https://jsonplaceholder.typicode.com/users";

@Injectable({
  providedIn: 'root'
})

export class UsuariosService {

  constructor(private http: HttpClient) { }

  traerUsuarios(usuario: string) {
    return this.http.get<UsuarioResponse[]>(`${API_URL}?username=${usuario}`);
  }

}