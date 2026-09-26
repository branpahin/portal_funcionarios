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
      },
      {
        path: 'modal-editar-funcionario',
        loadComponent: () => import('../models/modal-editar-funcionario/modal-editar-funcionario.page').then( m => m.ModalEditarFuncionarioPage),
        canActivate: [authGuard]
      },
      {
        path: 'panel-solicitudes',
        loadComponent: () =>
          import('../pages/panel-solicitudes/panel-solicitudes.page')
            .then(m => m.PanelSolicitudesPage),
        canActivate: [authGuard]
      },

      {
        path: 'panel-solicitudes/realizar',
        loadComponent: () =>
          import('../pages/panel-solicitudes/diligenciar-solicitud/diligenciar-solicitud.page')
            .then(m => m.DiligenciarSolicitudPage)
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
