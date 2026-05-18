import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
              private chatService : ChatService,
              private cd : ChangeDetectorRef){}

  ngOnInit(): void {
    this.chatService.traerMensajes().subscribe((data) => {
    this.mensajes = data;

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
      mensaje: this.nuevoMensaje,
      fecha: new Date()
    }

    const res = await this.chatService.guardarMensaje(mensaje);
    console.log('Guardado:', res);
    this.nuevoMensaje = '';
    this.cd.detectChanges()
    
    

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
