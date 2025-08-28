import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPage } from './layout.page';
import { authGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutPage,  // 🔥 Aquí establecemos el Layout como base
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // 🛠 Asegura que se redirija correctamente
      {
        path: 'home',
        loadComponent: () => import('../home/home.page').then(m => m.HomePage),
        // canActivate: [authGuard]
      },
      {
        path: 'listado-colaboradores',
        loadComponent: () => import('../pages/listado-colaboradores/listado-colaboradores.page').then(m => m.ListadoColaboradoresPage),
        canActivate: [authGuard]
      },
      {
        path: 'actualizacion-filtros',
        loadComponent: () => import('../pages/actualizacion-filtros/actualizacion-filtros.page').then(m => m.ActualizacionFiltrosPage),
        canActivate: [authGuard]
      },
      {
        path: 'listado-usuarios',
        loadComponent: () => import('../pages/listado-usuarios/listado-usuarios.page').then( m => m.ListadoUsuariosPage),
        canActivate: [authGuard]
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
