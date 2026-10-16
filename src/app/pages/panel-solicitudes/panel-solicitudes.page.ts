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
import { SecureStorageService } from 'src/services/secure-storage.service';

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
  rol:number|null = 0;

  pageSizeMisSolicitudes = 5;
  pageSizeSolicitudesRecibidas = 5;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private service:PortalService,
    private secureStorage: SecureStorageService,
  ) {}

  async ngOnInit(): Promise<void> {
    // this.cargarSolicitudes();
    this.rol = await this.secureStorage.get<number>('rolSeleccionado');
    if(this.rol!=236){
      this.esAdministrador = true
    }else{
      this.esAdministrador = false
    }
    this.obtenerMisSolicitudes();
  }

  get totalPagesMisSolicitudes(): number {
    return Math.ceil(
      this.totalRecordsMisSolicitudes /
      this.pageSizeSolicitudesRecibidas
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

  onPageSizeChangeSolicitudesRecibidas() {

    this.currentPageMisSolicitudes = 1;

    this.obtenerMisSolicitudes();
  }

  get totalPagesSolicitudesRecibidas(): number {
    return Math.ceil(
      this.totalRecordsSolicitudesRecibidas /
      this.pageSizeSolicitudesRecibidas
    );
  }

  changePageSolicitudesRecibidas(page: number) {

    if (
      page <= 0 ||
      page > this.totalPagesSolicitudesRecibidas
    ) {
      return;
    }

    this.currentPageSolicitudesRecibidas = page;

    this.obtenerMisSolicitudes();
  }

  onPageSizeChangeMisSolicitudes() {

    this.currentPageMisSolicitudes = 1;

    this.obtenerMisSolicitudes();
  }

  async obtenerMisSolicitudes() {

    let payload = {};

    if(this.esAdministrador){
      payload = {
        first: (this.currentPageSolicitudesRecibidas - 1) * this.pageSizeSolicitudesRecibidas,
        rows: this.pageSizeSolicitudesRecibidas
      };
    } else {
        payload = {
        first: (this.currentPageMisSolicitudes - 1) * this.pageSizeMisSolicitudes,
        rows: this.pageSizeMisSolicitudes
      };
    }

    this.service.getobtenerMisSolicitudesPag(JSON.stringify(payload)).subscribe({
      next: (resp) => {

       
        if(this.esAdministrador){
          this.solicitudesRecibidas = resp.data.datos.listadoSolicitudes;
          this.totalRecordsSolicitudesRecibidas = resp.data.totalRecords;
        } else {
           this.misSolicitudes = resp.data.datos.listadoSolicitudes;
           this.totalRecordsMisSolicitudes = resp.data.totalRecords;
        }
        
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
      this.obtenerMisSolicitudes();
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
          solicitud:solicitud,
          esAdministrador:this.esAdministrador
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
