import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_MAZO = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"

@Injectable({
  providedIn: 'root',
})


export class CartasService {
  constructor(private http: HttpClient){};

  traerMazo(){
    return this.http.get<any>(API_MAZO)
  }

  darCarta(deck_id : string){
    return this.http.get<any>(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)

  }

}
