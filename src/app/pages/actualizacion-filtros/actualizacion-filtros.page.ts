import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModuleService } from 'src/services/modulos/module.service';
import { IONIC_COMPONENTS } from '../../imports/ionic-imports';
import { PortalService } from 'src/services/portal.service';
import { ModalController } from '@ionic/angular';
import { ModalCrearFiltroPage } from 'src/app/models/modal-crear-filtro/modal-crear-filtro.page';

@Component({
  selector: 'app-actualizacion-filtros',
  templateUrl: './actualizacion-filtros.page.html',
  styleUrls: ['./actualizacion-filtros.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActualizacionFiltrosPage implements OnInit {
  param:any;
  tipoFiltro: string = '';
  filtros:any[]=[];
  pageSize = 10; // Tamaño por página (10, 50, 100)
  currentPage = 1;
  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private service:PortalService,private route: ActivatedRoute, 
    private moduleService:ModuleService, private modalController: ModalController,) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.tipoFiltro = params['tipo'];
    });

    await this.nombresFiltrosDet()
    await this.params();
    // this.param=this.moduleService.getFiltros();
    // this.filtros = this.param[this.tipoFiltro]
    
  }

  async params(){
    this.service.getCaposFiltro().subscribe({
      next:async(resp)=>{
        try{
          // this.filtros=resp.data.datos;
          this.moduleService.setFiltros(resp.data.datos)
          // this.filtroKeys = Object.keys(this.filtros);
        }catch(error){
          console.error("Respuesta Login: ", error)
        }
      }
    })
  }

  async nombresFiltrosDet(){
    this.service.getNombresFiltrosDet(this.tipoFiltro).subscribe({
      next:async(resp)=>{
        try{
          console.log("datos: ",resp)
          this.filtros=resp.data.datos.filtros;
        }catch(error){
          console.error("Respuesta Login: ", error)
        }
      }
    })
  }

  async abrirModalEditar(data:any | string, editar:boolean) {
    const modal = await this.modalController.create({
      component: ModalCrearFiltroPage,
      componentProps: { data: data, editar: editar}
    });

    modal.style.cssText = `
      --border-radius: 10px;
    `;

    await modal.present();
    
    await modal.onWillDismiss();

    this.ngOnInit();
  }

  get totalPages(): number {
    return Math.ceil(this.filtros.length / this.pageSize);
  }

   getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'swap-vertical-outline';
    return this.sortDirection === 'asc' ? 'chevron-up-outline' : 'chevron-down-outline';
  }

  get paginatedFuncionarios() {
    let data = [...this.filtros];

    // Filtro de búsqueda
    if (this.searchText) {
      const text = this.searchText.toLowerCase();
      data = data.filter(item =>
        Object.values(item).some(val =>
          val?.toString().toLowerCase().includes(text)
        )
      );
    }

    // Ordenamiento
    if (this.sortColumn) {
      data.sort((a, b) => {
        const valA = a[this.sortColumn];
        const valB = b[this.sortColumn];
        if (valA == null) return 1;
        if (valB == null) return -1;
        return this.sortDirection === 'asc'
          ? valA.toString().localeCompare(valB.toString(), 'es', { numeric: true })
          : valB.toString().localeCompare(valA.toString(), 'es', { numeric: true });
      });
    }

    const start = (this.currentPage - 1) * this.pageSize;
    return data.slice(start, start + this.pageSize);
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }


}
