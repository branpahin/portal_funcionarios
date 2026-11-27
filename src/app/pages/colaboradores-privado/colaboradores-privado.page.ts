
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { PortalService } from 'src/services/portal.service';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { ModalInfoColaboradorPage } from 'src/app/models/modal-info-colaborador/modal-info-colaborador.page';
import { UserInteractionService } from 'src/services/user-interaction-service.service';

@Component({
  selector: 'app-colaboradores-privado',
  templateUrl: './colaboradores-privado.page.html',
  styleUrls: ['./colaboradores-privado.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IONIC_COMPONENTS
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ColaboradoresPrivadoPage implements OnInit {

  form: FormGroup;

  colaborador: any[] = [];

  url: boolean = true;

  // ServerSide
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;

  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private fb: FormBuilder,
    private service: PortalService,
    private modalController: ModalController,
    private UserInteractionService: UserInteractionService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre: [''],
      cedula: ['']
    });
  }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {

      const cedula = params.get('cedula');

      if (cedula) {

        this.url = true;
        this.URLBuscar(cedula);

      } else {

        this.url = false;

        // Consultar automáticamente al cargar la página
        this.colaboradores();

      }

    });

  }

  // ==========================================
  // CONSULTA SERVER SIDE DE COLABORADORES
  // ==========================================

  async colaboradores() {

    this.UserInteractionService.showLoading('Cargando colaboradores...');

    const filters: Record<string, any[]> = {};

    if (this.searchText.trim()) {

      filters['nombres'] = [
        {
          value: this.searchText.trim(),
          matchMode: 'contains',
          operator: 'and'
        }
      ];

    }

    const payload = {
      first: (this.currentPage - 1) * this.pageSize,
      rows: this.pageSize,
      sortField: this.sortColumn,
      sortOrder: this.sortDirection === 'asc' ? 1 : 2,
      filters
    };

    this.service.getConsultarColaboradores(JSON.stringify(payload))
      .subscribe({

        next: (resp) => {

          try {

            const datos = resp.data.datos;

            this.colaborador = datos.nombres_Colaboradores || [];

            this.totalRecords = resp.data.totalRecords ??
              this.colaborador.length;

          } catch (error) {

            console.error('Error al procesar colaboradores:', error);

            this.colaborador = [];
            this.totalRecords = 0;

          } finally {

            this.UserInteractionService.dismissLoading();

          }

        },

        error: (err) => {

          this.UserInteractionService.dismissLoading();

          this.UserInteractionService.presentToast(
            err.error?.data?.mensaje ||
            err.error?.data?.error ||
            'Error al consultar los colaboradores'
          );

        }

      });

  }

  // ==========================================
  // FILTRAR COLABORADORES POR NOMBRE
  // ==========================================

  filtrarColaboradores(event: any) {

    this.searchText = event.detail.value || '';

    this.currentPage = 1;

    this.colaboradores();

  }

  // ==========================================
  // CONSULTAR POR CÉDULA
  // ==========================================

  buscar(credentials: any) {

    const cedula = credentials.cedula;

    if (cedula === null || cedula === undefined || cedula.toString().trim() === '') {

      this.UserInteractionService.presentToast('Campo cédula requerido');

      return;

    }

    this.consultarColaborador(cedula);

  }

  // ==========================================
  // SELECCIONAR COLABORADOR DE LA LISTA
  // ==========================================

  seleccionarColaborador(colaborador: any) {

    if (!colaborador?.identificacion) {

      this.UserInteractionService.presentToast(
        'No se encontró la identificación del colaborador'
      );

      return;

    }

    this.consultarColaborador(colaborador.identificacion);

  }

  // ==========================================
  // CONSULTA INDIVIDUAL
  // ==========================================

  consultarColaborador(cedula: string | number) {

    const credentials = {
      cedula: Number(cedula),
      guia: 'cedula'
    };

    if (!credentials.cedula || !Number.isFinite(credentials.cedula)) {

      this.UserInteractionService.presentToast('Cédula inválida');

      return;

    }

    this.UserInteractionService.showLoading('Consultando...');

    this.service.postConsultarColaborador(credentials).subscribe({

      next: async (resp) => {

        try {

          this.UserInteractionService.dismissLoading();
          this.abrirModalInfoColaborador(resp.body.data.datos);

        } catch (error) {

          console.error('Error al procesar respuesta:', error);

          this.UserInteractionService.dismissLoading();

        }

      },

      error: (err) => {

        this.UserInteractionService.dismissLoading();

        this.UserInteractionService.presentToast(
          err.error?.data?.mensaje ||
          err.error?.data?.error ||
          'Error desconocido, por favor contacte al área encargada'
        );

      }

    });

  }

  // ==========================================
  // CONSULTA DESDE URL
  // ==========================================

  async URLBuscar(cedula: string) {

    this.consultarColaborador(cedula);

  }

  // ==========================================
  // PAGINACIÓN SERVER SIDE
  // ==========================================

  get totalPages(): number {

    return Math.ceil(this.totalRecords / this.pageSize);

  }

  changePage(page: number) {

    if (page <= 0 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;

    this.colaboradores();

  }

  onPageSizeChange() {

    this.currentPage = 1;

    this.colaboradores();

  }

  // ==========================================
  // ORDENAMIENTO SERVER SIDE
  // ==========================================

  sortBy(column: string) {

    if (this.sortColumn === column) {

      this.sortDirection =
        this.sortDirection === 'asc' ? 'desc' : 'asc';

    } else {

      this.sortColumn = column;
      this.sortDirection = 'asc';

    }

    this.colaboradores();

  }

  getSortIcon(column: string): string {

    if (this.sortColumn !== column) {
      return 'swap-vertical-outline';
    }

    return this.sortDirection === 'asc'
      ? 'chevron-up-outline'
      : 'chevron-down-outline';

  }

  // ==========================================
  // MODAL INFORMACIÓN COLABORADOR
  // ==========================================

  async abrirModalInfoColaborador(data: any) {

    const modal = await this.modalController.create({

      component: ModalInfoColaboradorPage,

      componentProps: {
        colaborador: data
      },

      backdropDismiss: !this.url,
      canDismiss: !this.url

    });

    modal.style.cssText = `
      --border-radius: 10px;
    `;

    return await modal.present();

  }

}
