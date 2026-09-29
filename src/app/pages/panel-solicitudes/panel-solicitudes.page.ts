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
  currentPage = 1;
  pageSize = 5;
  totalRecordsMisSolicitudes = 0;
  totalRecordsSolicitudesRecibidas = 0;
  currentPageMisSolicitudes = 1;
  currentPageSolicitudesRecibidas = 1;

  pageSizeMisSolicitudes = 5;
  pageSizeSolicitudesRecibidas = 5;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private service:PortalService,
  ) {}

  ngOnInit(): void {
    // this.cargarSolicitudes();
    this.obtenerMisSolicitudes();
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

  get totalPagesMisSolicitudes(): number {
    return Math.ceil(
      this.totalRecordsMisSolicitudes /
      this.pageSizeMisSolicitudes
    );
  }

  changePageMisSolicitudes(page: number) {

    if (
      page <= 0 ||
      page > this.totalPagesMisSolicitudes
    ) {
      return;
    }

    this.currentPageMisSolicitudes = page;

    this.obtenerMisSolicitudes();
  }

  onPageSizeChangeMisSolicitudes() {

    this.currentPageMisSolicitudes = 1;

    this.obtenerMisSolicitudes();
  }

  async obtenerMisSolicitudes() {

    const payload = {
      first: (this.currentPageMisSolicitudes - 1) * this.pageSizeMisSolicitudes,
      rows: this.pageSizeMisSolicitudes
    };

    this.service.getobtenerMisSolicitudesPag(JSON.stringify(payload)).subscribe({
      next: (resp) => {

        this.misSolicitudes =
          resp.data.datos.listadoSolicitudes;

        this.totalRecordsMisSolicitudes =
          resp.data.totalRecords;
      },

      error: (err) => {
        console.error('Error obteniendo mis solicitudes:', err);
      }
    });
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
    console.log("solicitud: ", solicitud)
    this.router.navigate(
      ['/layout/panel-solicitudes/realizar'],
      {
        state: {
          solicitud:solicitud
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

  obtenerClaseEstado(estado: number): string {

    switch (estado) {

      case 1:
        return 'estado-pendiente';

      case 2:
        return 'estado-aprobada';

      case 3:
        return 'estado-rechazada';

      default:
        return 'estado-default';
    }
  }

}
