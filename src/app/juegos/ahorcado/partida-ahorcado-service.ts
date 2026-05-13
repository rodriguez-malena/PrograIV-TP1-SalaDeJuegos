import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class PartidaAhorcadoService {
  private firestore = inject(Firestore) 

  async guardarDatosPartidaAhorcado(usuario: string, resultado: string, tiempoTotal: string, cantidadLetras: number, cantidadErrores: number){
    await addDoc(collection(this.firestore, 'partidas-ahorcado'), {
      usuario,
      resultado,
      tiempoTotal,
      cantidadLetras,
      cantidadErrores
    })};
}
