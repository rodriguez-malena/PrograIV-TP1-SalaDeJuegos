import { inject, Injectable } from '@angular/core';

import { Firestore, collection, addDoc, collectionData, query, orderBy } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  firestore = inject(Firestore)

  traerMensajes(){
    const chatRef = collection(this.firestore, 'chat')

    const orden = query(chatRef, orderBy('fecha', 'asc'))

    return collectionData(orden, { idField: 'id' });
  }

  guardarMensaje(mensaje: any) {
    const chatRef = collection(this.firestore, 'chat');
    console.log(mensaje);
    return addDoc(chatRef, mensaje);
  }

}
