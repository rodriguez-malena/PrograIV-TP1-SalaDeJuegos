import { inject, Injectable } from '@angular/core';

import { Firestore, collection, addDoc, collectionData, query, orderBy,limit, serverTimestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  firestore = inject(Firestore)

  traerMensajes(){
    const chatRef = collection(this.firestore, 'chat')

    const consulta = query(chatRef, orderBy('fecha', 'asc'), limit(50))

    return collectionData(consulta, { idField: 'id' });
  }

  guardarMensaje(mensaje: any) {
    const chatRef = collection(this.firestore, 'chat');
    console.log(mensaje);
    return addDoc(chatRef,{...mensaje, fecha: serverTimestamp()});
  }

}
