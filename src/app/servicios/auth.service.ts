import { Injectable, inject, signal} from '@angular/core';
import { Firestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';


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
    
    
    const uid = res.user.uid;

    const usuarioDocRef = doc(this.firestore, 'usuarios', uid);

    const usuarioDocSnap = await getDoc(usuarioDocRef);

    const datosUsuario = usuarioDocSnap.data();

    const userData = {
      uid: res.user.uid,
      email: res.user.email,
      nombre: datosUsuario?.['nombre'],
      apellido: datosUsuario?.['apellido'],
      edad: datosUsuario?.['edad']
    }

    sessionStorage.setItem('user', JSON.stringify(userData))
    this.user.set(userData)
    return res
  }
  
  getUser() {
    const userString = sessionStorage.getItem('user');
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
    sessionStorage.removeItem('user');
    this.user.set(null);
  }

    
  }


