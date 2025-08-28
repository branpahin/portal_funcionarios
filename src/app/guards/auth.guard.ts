import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { PermisosService } from 'src/services/permisos.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const permisosService = inject(PermisosService);

  const token = localStorage.getItem('token');

  // Si hay token, evaluar lo demás
  if (token) {
    // Obtener navegación actual
    if (state.url.includes('actualizacion-filtros')) {
      const permisos = permisosService.getPermisos();
      permisosService.setPermisos(permisos);
      return true;
    }
    const navigation = router.getCurrentNavigation();
    
    const navigationState = navigation?.extras?.state as { fromMenu?: boolean };
    console.log("navigation: ",navigationState)
    const permisos = navigation?.extras?.state?.['permisos'] || {};
    permisosService.setPermisos(permisos);

    


    if (navigationState?.fromMenu) {
      return true;
    }

    // Redirigir si no viene del menú
    return router.parseUrl('/layout');
  }

  // Si no hay token, ir a login
  return router.parseUrl('/login');
};