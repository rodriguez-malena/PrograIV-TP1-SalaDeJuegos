import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

    {
        path: '',
        redirectTo: '/bienvenida',
        pathMatch: 'full'
    },
    {
        path:'bienvenida',
        loadComponent: () => import('./components/bienvenida/bienvenida').then(m => m.Bienvenida)
    },

    {
        path:'home',
        loadComponent:()=> import('./components/home/home').then(m => m.Home),
        canActivate:[authGuard]
    },
    {
        path:'login',
        loadComponent: () => import('./components/login/login').then(m => m.Login)
    },
    {
        path:'registro',
        loadComponent: () => import('./components/registro/registro').then(m => m.Registro)
    },
    {
        path:'quien-soy',
        loadComponent: () => import('./components/quien-soy/quien-soy').then(m => m.QuienSoy),
        canActivate:[authGuard]
    },
    {
        path: 'ahorcado',
        loadChildren:() => import('./juegos/ahorcado/ahorcado-module').then(m => m.AhorcadoModule),
        canActivate:[authGuard]
    },
    {
        path:'mayor-menor',
        loadChildren:() => import('./juegos/mayor-menor/mayor-menor-module').then(m => m.MayorMenorModule),
        canActivate:[authGuard]
    },
    {
        path:'**',
        loadComponent: () => import('./components/error/error').then(m => m.Error)
        
    },
    
];
