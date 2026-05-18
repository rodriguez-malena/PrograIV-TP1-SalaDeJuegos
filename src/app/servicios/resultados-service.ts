import { inject, Injectable } from '@angular/core';
import {Firestore, collection, addDoc, collectionData, query, where,orderBy, limit } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root',
})
export class ResultadosService {
  private firestore = inject(Firestore)

  async guardarDatosPartida(juego: string, usuario: string, gano: boolean, cantidadAciertos: number, cantidadErrores:number, puntaje: number, vidas: number, tiempoTotal: string, fecha: Date){
    await addDoc(collection(this.firestore, 'partidas-juegos'),{
      juego,
      usuario,
      gano,
      cantidadAciertos,
      cantidadErrores,
      puntaje,
      vidas,
      tiempoTotal,
      fecha
    })
  }

  obtenerResultados(nombreJuego : string) {

    const referencia = collection(this.firestore, 'partidas-juegos');
    const consulta = query(referencia, where('juego', '==', nombreJuego), orderBy('puntaje', 'desc'), limit(10));

    return collectionData(consulta, { idField: 'id' });
  }
  
}
