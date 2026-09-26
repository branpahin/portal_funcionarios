import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleService } from 'src/services/modulos/module.service';
import { IONIC_COMPONENTS } from '../../imports/ionic-imports';
import { PortalService } from 'src/services/portal.service';
import { ModalController } from '@ionic/angular';
import { ModalCrearFiltroPage } from 'src/app/models/modal-crear-filtro/modal-crear-filtro.page';
import { PermisosService } from 'src/services/permisos.service';
import { ModalCrearSolicitudPage } from 'src/app/models/modal-crear-solicitud/modal-crear-solicitud.page';

@Component({
  selector: 'app-panel-solicitudes',
  templateUrl: './panel-solicitudes.page.html',
  styleUrls: ['./panel-solicitudes.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PanelSolicitudesPage implements OnInit {
  
  esAdministrador = true;
  misSolicitudes: any[] = [];
  solicitudesRecibidas: any[] = [];

  constructor(
    private router: Router,
    private modalController: ModalController,
  ) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {

    this.misSolicitudes = [
      {
        id: 1,
        nombre: 'Solicitud de vacaciones',
        descripcion: 'Solicitud de vacaciones correspondiente al periodo 2026.',
        estado: 'Pendiente',
        fecha: '2026-09-24',
        destinatario: 'Recursos Humanos'
      },
      {
        id: 2,
        nombre: 'Solicitud de equipo',
        descripcion: 'Solicitud de equipo de cómputo para labores administrativas.',
        estado: 'Aprobada',
        fecha: '2026-09-22',
        destinatario: 'Tecnología'
      },
      {
        id: 3,
        nombre: 'Solicitud de acceso',
        descripcion: 'Solicitud de acceso a sistemas internos.',
        estado: 'En proceso',
        fecha: '2026-09-20',
        destinatario: 'Tecnología'
      }
    ];


    if (this.esAdministrador) {

      this.solicitudesRecibidas = [
        {
          id: 101,
          nombre: 'Solicitud de acceso',
          descripcion: 'Solicitud de acceso al sistema administrativo.',
          estado: 'Pendiente',
          fecha: '2026-09-24',
          solicitante: 'Juan Pérez'
        },
        {
          id: 102,
          nombre: 'Solicitud de vacaciones',
          descripcion: 'Solicitud de vacaciones para el próximo periodo.',
          estado: 'En proceso',
          fecha: '2026-09-23',
          solicitante: 'María Rodríguez'
        }
      ];

    } else {

      this.solicitudesRecibidas = [];

    }
  }

  async crearSolicitud(): Promise<void> {
    const modal = await this.modalController.create({
      component: ModalCrearSolicitudPage,
      cssClass: 'modal-crear-solicitud'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.creado) {
      this.cargarSolicitudes();
    }
  }

  realizarSolicitud(): void {
    this.router.navigate(['/layout/panel-solicitudes/realizar']);
  }

  verSolicitud(solicitud: any): void {
    this.router.navigate(
      ['/solicitudes/detalle', solicitud.id],
      {
        state: {
          solicitud
        }
      }
    );
  }

  verTodasMisSolicitudes(): void {
    this.router.navigate(['/solicitudes/mis-solicitudes']);
  }

  verSolicitudesRecibidas(): void {
    this.router.navigate(['/solicitudes/recibidas']);
  }

  obtenerClaseEstado(estado: string): string {

    switch (estado?.toLowerCase()) {

      case 'pendiente':
        return 'estado-pendiente';

      case 'en proceso':
        return 'estado-proceso';

      case 'aprobada':
        return 'estado-aprobada';

      case 'rechazada':
        return 'estado-rechazada';

      case 'finalizada':
        return 'estado-finalizada';

      case 'borrador':
        return 'estado-borrador';

      default:
        return 'estado-default';
    }
  }

}
