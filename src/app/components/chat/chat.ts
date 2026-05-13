import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf, NgFor, DatePipe} from "@angular/common";
import { AuthService } from '../../servicios/auth.service';
import { ChatService } from '../../servicios/chat-service';


@Component({
  selector: 'app-chat',
  standalone:true,
  imports: [FormsModule, NgClass, NgIf, NgFor, DatePipe],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
})
export class Chat implements OnInit {
  
  mostrarChat : boolean = false
  nuevoMensaje: string = '';
  mensajes: any =[];

  constructor(public authService : AuthService,
              private chatService : ChatService){}

  ngOnInit(): void {
    this.chatService.traerMensajes().subscribe({
     next: (data) => {
      console.log('🔥 STREAM DATA:', data);
      this.mensajes = data;
    },
    error: (err) => console.error('❌ STREAM ERROR:', err)
  });

    setTimeout(() => {
        this.scrollHastaElUltimoElemento();
      },50)
    
}

  async enviarMensaje(){
    if(this.nuevoMensaje.trim() == ''){
      return
    }

    console.log(this.nuevoMensaje);

    const usuario = this.authService.user()
    
    let mensaje = {
      uid: usuario?.uid,
      usuario: usuario?.nombre,
      mensaje: this.nuevoMensaje,
      fecha: new Date()
    
    }
     try {
        const res = await this.chatService.guardarMensaje(mensaje);
        console.log('GUARDADO:', res);
    } catch (err) {
      console.error('❌ ERROR GUARDANDO:', err);
    }

    this.nuevoMensaje = '';
  }

  scrollHastaElUltimoElemento(){
    let elementos = document.getElementsByClassName('mensaje')

    if(elementos.length === 0){
    return;
  }
    let ultimoElemento: any = elementos[elementos.length-1];
    
    let toppos = ultimoElemento.offsetTop;

   const contenedor = document.getElementById('contenedorMensajes');

   if(contenedor){
     contenedor.scrollTop = toppos;
   }

  }

}
