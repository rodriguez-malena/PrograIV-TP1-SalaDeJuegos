import { Injectable, inject, signal} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, setDoc, doc } from '@angular/fire/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user = signal<any>(null);

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  constructor() {
    const user = this.getUser(); 
    if (user) {
      this.user.set(user);
    }
  }
  
  registrar(correo: string, clave: string) {
      return createUserWithEmailAndPassword(this.auth, correo, clave);
  }

  async iniciarSesion(correo: string, clave: string) {
    const res = await signInWithEmailAndPassword(this.auth, correo, clave);
    
    const userData = {
      uid: res.user.uid,
      email: res.user.email
    }

    localStorage.setItem('user', JSON.stringify(userData))
    this.user.set(userData)
    return res
  }
  
  getUser() {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
}
  async guardarDatosUsuario(uid: string, correo: string, nombre: string, apellido : string, edad: number) {
  await setDoc(doc(this.firestore, 'usuarios', uid), {
    uid,
    email: correo,
    nombre,
    apellido,
    edad
  })};

  isLoggedIn() {
    return this.user() !== null;  
  }

  cerrarSesion() {
    signOut(this.auth); 
    localStorage.removeItem('user');
    this.user.set(null);
  }

    
  }


