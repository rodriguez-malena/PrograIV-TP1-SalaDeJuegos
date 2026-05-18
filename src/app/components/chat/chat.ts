import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf, NgFor, DatePipe} from "@angular/common";
import { AuthService } from '../../servicios/auth.service';
import { ChatService } from '../../servicios/chat-service';
import { Mensaje } from '../../modelos/mensaje';

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
  mensajes = signal<Mensaje[]>([])

  constructor(public authService : AuthService,
              private chatService : ChatService,
              ){}

  ngOnInit(): void {
    this.chatService.traerMensajes().subscribe((respuesta: any[]) => {
    this.mensajes.set(respuesta);

    setTimeout(() => {
      this.scrollHastaElUltimoElemento();
    }, 20);

  })
    
}

  async enviarMensaje(){
    if(this.nuevoMensaje == ''){
      return
    }

    console.log(this.nuevoMensaje);

    const usuario = this.authService.user()
    
    let mensaje = {
      uid: usuario?.uid,
      usuario: usuario?.nombre,
      mensaje: this.nuevoMensaje.trim(),
    }

    const res = await this.chatService.guardarMensaje(mensaje);
    console.log('Guardado:', res);
    this.nuevoMensaje = '';
    
    

  }

  scrollHastaElUltimoElemento(){

   const contenedor = document.getElementById('contenedorMensajes');

   if(!contenedor){
      return;
    }

    contenedor.scrollTop = contenedor.scrollHeight;

  }

}
