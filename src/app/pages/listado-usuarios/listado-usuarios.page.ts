import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PortalService } from 'src/services/portal.service';
import { ModuleService } from 'src/services/modulos/module.service';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, eye,close, pencil, key } from 'ionicons/icons';
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
  constructor(private service:PortalService, 
      private moduleService:ModuleService, 
      private modalController: ModalController,
      private fb: FormBuilder,
      private UserInteractionService: UserInteractionService) {
        addIcons({ pencil, eye, close, add, key}); 
       }

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

  get paginatedFuncionarios() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.funcionarios.slice(start, start + this.pageSize);
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
