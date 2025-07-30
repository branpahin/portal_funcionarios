import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { PortalService } from 'src/services/portal.service';
import { ModuleService } from 'src/services/modulos/module.service';
import { ModalController } from '@ionic/angular';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { CreacionUsuarioPage } from '../creacion-usuario/creacion-usuario.page';
import { ModalCambiarClaveComponent } from 'src/app/models/modal-cambiar-clave/modal-cambiar-clave.component';
import { UserInteractionService } from 'src/services/user-interaction-service.service';
import { TypeThemeColor } from 'src/app/enums/TypeThemeColor';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.page.html',
  styleUrls: ['./listado-usuarios.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListadoUsuariosPage implements OnInit {

  param:any;
  filtros:any;
  funcionarios:any[]=[];
  estadosProcesoCatalogo:any[]=[];
  // empleadoForm: FormGroup = new FormGroup({});
  pageSize = 10; // Tamaño por página (10, 50, 100)
  currentPage = 1;
  esPC: boolean | undefined;
  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private service:PortalService, 
      private moduleService:ModuleService, 
      private modalController: ModalController,
      private fb: FormBuilder,
      private UserInteractionService: UserInteractionService) {}

  async ngOnInit() {
    this.param=this.moduleService.getParam();
    this.filtros=this.moduleService.getFiltros();
    this.estadosProcesoCatalogo = this.filtros['estados_Proceso'] || [];
    await this.colaboradores()
  }

  async estadoProceso(response:any){
    console.log("procesos: ",this.estadosProcesoCatalogo)
    this.funcionarios = response.map((f:any) => {
      const ids = f.estadO_PROCESO.split(',').map((id: string) => parseInt(id.trim(), 10));
      const descripciones = this.estadosProcesoCatalogo
        .filter(e => ids.includes(e.id))
        .map(e => e.descripcion);

      return {
        ...f,
        estadO_PROCESO_DESCRIPCIONES: descripciones.join(', ')
      };
    });
  }

  async colaboradores() {
    this.UserInteractionService.showLoading('Cargando...');
    this.service.getConsultatUsuarios().subscribe({
      next:async(resp)=>{
        try{
          console.log("Respuesta Login: ", resp)
          this.funcionarios=resp.data.datos.listadoUsuariosAPP
          await this.estadoProceso(this.funcionarios)
          this.UserInteractionService.dismissLoading()
        }catch(error){
          console.error("Respuesta Login: ", error)
          this.UserInteractionService.dismissLoading()
        }
      },
      error: (err) =>{
        this.UserInteractionService.dismissLoading()
        this.UserInteractionService.presentToast(err)
      }
    })
  }

  get totalPages(): number {
    return Math.ceil(this.funcionarios.length / this.pageSize);
  }

  // get paginatedFuncionarios() {
  //   const start = (this.currentPage - 1) * this.pageSize;
  //   return this.funcionarios.slice(start, start + this.pageSize);
  // }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'swap-vertical-outline';
    return this.sortDirection === 'asc' ? 'chevron-up-outline' : 'chevron-down-outline';
  }

  get paginatedFuncionarios() {
    let data = [...this.funcionarios];

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

  async abrirModalCrearFuncionario() {
    const modal = await this.modalController.create({
      component: CreacionUsuarioPage,
    });

    modal.style.cssText = `
      --border-radius: 10px;
    `;
    await modal.present();
    await modal.onWillDismiss();

    this.ngOnInit();
  }

  async abrirModalEditar(data:any, editar:boolean) {
    const modal = await this.modalController.create({
      component: CreacionUsuarioPage,
      componentProps: { usuario: data, editar: editar}
    });

    modal.style.cssText = `
      --border-radius: 10px;
    `;

    await modal.present();
    
    await modal.onWillDismiss();

    this.ngOnInit();
  }
  
  async abrirModalClave(usuario:any) {
    const modal = await this.modalController.create({
      component: ModalCambiarClaveComponent,
      componentProps: {
        idUsuario: usuario?.id ?? 0
      }
    });
      modal.style.cssText = `
      --border-radius: 10px;
    `;

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.service.postActualizarClave(data).subscribe({
        next: (resp) => this.UserInteractionService.presentToast('Clave actualizada', TypeThemeColor.SUCCESS),
        error: (err) => this.UserInteractionService.presentToast(err)
      });
      this.ngOnInit();
    }
  }

}
