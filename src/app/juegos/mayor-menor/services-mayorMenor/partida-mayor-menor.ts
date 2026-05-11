import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root',
})

export class PartidaMayorMenor {

  private firestore = inject(Firestore) 

  async guardarDatosPartidaMayorMenor(usuario: string, resultado: string, cantidadCartas: number, puntos: number, vidas: number){
    await addDoc(collection(this.firestore, 'partidas-MayorOMenor'), {
      usuario,
      resultado,
      cantidadCartas,
      puntos,
      vidas,
    })
  }
}
