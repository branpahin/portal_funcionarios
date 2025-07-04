import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'layout',
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule),
    canActivate: [authGuard]
  },
  {
    path: 'modal-crear-funcionario',
    loadComponent: () => import('./models/modal-crear-funcionario/modal-crear-funcionario.page').then( m => m.ModalCrearFuncionarioPage),
    canActivate: [authGuard]
  },
  {
    path: 'colaboradores-publico',
    loadComponent: () => import('./pages/colaboradores-publico/colaboradores-publico.page').then( m => m.ColaboradoresPublicoPage)
  },
  {
    path: 'modal-info-colaborador',
    loadComponent: () => import('./models/modal-info-colaborador/modal-info-colaborador.page').then( m => m.ModalInfoColaboradorPage)
  },
  {
    path: 'modal-editar-funcionario',
    loadComponent: () => import('./models/modal-editar-funcionario/modal-editar-funcionario.page').then( m => m.ModalEditarFuncionarioPage),
    canActivate: [authGuard]
  },
  {
    path: 'modal-search',
    loadComponent: () => import('./models/modal-search/modal-search.page').then( m => m.ModalSearchPage)
  }
];
