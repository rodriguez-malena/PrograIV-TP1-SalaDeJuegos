import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {

  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.cerrarSesion();
    this.router.navigate(['/bienvenida']); 
  }

}
