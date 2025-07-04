import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { ErrorMensajeComponent } from 'src/common/error-mensaje/error-mensaje.component';
import { ModalController } from '@ionic/angular';
import { ModalSearchPage } from 'src/app/models/modal-search/modal-search.page';
import { PortalService } from 'src/services/portal.service';
import { ModuleService } from 'src/services/modulos/module.service';

@Component({
  selector: 'app-creacion-usuario',
  templateUrl: './creacion-usuario.page.html',
  styleUrls: ['./creacion-usuario.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, ErrorMensajeComponent, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreacionUsuarioPage implements OnInit {

  empleadoForm: FormGroup = new FormGroup({});
  funcionarios:any[]=[];
  param:any;
  ciudadTrabajo: any[] = [];
  empresas: any[] = [];
  cedulaSeleccionada: string = '';
  constructor(private service:PortalService, private modalCtrl: ModalController, private fb: FormBuilder, private moduleService:ModuleService) {
    this.formulario();
   }

  ngOnInit() {
    this.param=this.moduleService.getFiltros();
    this.empleadoForm.get('ID_EMPRESA')?.valueChanges.subscribe(value => {
      this.selec('empresas');
    });
    this.empleadoForm.get('CIUDAD')?.valueChanges.subscribe(value => {
      this.selec('ciudadTrabajo');
    });
  }

  formulario(){
    this.empleadoForm = this.fb.group({
      ID_EMPRESA: [null, Validators.required], // NUMBER
      IDENTIFICACION: [null, Validators.required], // NUMBER
      CIUDAD: [null, Validators.required], // NUMBER
      ROL: ['', [Validators.required, Validators.maxLength(1)]], // CHAR(1 BYTE)
      CLAVE: ['', [Validators.required]],
      ESTADO_PROCESO: ['', [Validators.required, Validators.maxLength(30)]], // VARCHAR2(30 BYTE)
    });
  }


  async abrirSelectorCedula() {
    const modal = await this.modalCtrl.create({
      component: ModalSearchPage
    });
  
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.cedulaSeleccionada = data;
      console.log("datos: ",data)
      this.empleadoForm.patchValue({
        ID_EMPRESA: Number(data.empresa),
        IDENTIFICACION: data.identificacion,
        CIUDAD: data.ciudad,
        ROL: data.rol,
        ESTADO_PROCESO: data.estadO_PROCESO,
      });
    }
  }

  selec(lista:string, dato?:string){
    this.param=this.moduleService.getFiltros();
    if (lista === 'ciudadTrabajo') {
      this.ciudadTrabajo = this.param[lista] || [];
    } else if (lista === 'empresas') {
      this.empresas = this.param[lista] || [];
    }
    
  }

  guardarUsuario(){

  }
}
