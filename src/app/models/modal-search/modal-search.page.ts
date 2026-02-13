import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { PortalService } from 'src/services/portal.service';
import { ModuleService } from 'src/services/modulos/module.service';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.page.html',
  styleUrls: ['./modal-search.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalSearchPage implements OnInit {
  funcionarios: any[] = [];
  cedulasFiltradas: any[] = [...this.funcionarios];
  param:any;

  constructor(private modalCtrl: ModalController, private service:PortalService, private moduleService:ModuleService,) {}
  async ngOnInit() {
    this.param= await this.moduleService.getParam();
    this.listarUsuarios();
  }

  
  listarUsuarios(){
    this.param.estado_Proceso = this.param.estado_Proceso.replaceAll(';', ',');
    this.service.getListarUsuariosAgregar().subscribe({
      next:async(resp)=>{
        try{
          //console.log("Respuesta Login: ", resp)
          this.funcionarios=resp.data.datos.listadoColaboradores
          this.cedulasFiltradas= this.funcionarios;
        }catch(error){
          console.error("Respuesta Login: ", error)
        }
      }
    })
  }
  
  filtrarCedulas(event: any) {
    const valor = event.detail.value?.toLowerCase() || '';
    this.cedulasFiltradas = this.funcionarios.filter(cedula =>
      cedula.toLowerCase().includes(valor)
    );
  }

  seleccionar(data: any) {
    this.modalCtrl.dismiss(data);
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

}
