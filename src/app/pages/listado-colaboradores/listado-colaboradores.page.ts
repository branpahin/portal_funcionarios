import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import { add, close, eye, pencil } from 'ionicons/icons';
import { ModuleService } from 'src/services/modulos/module.service';
import { PortalService } from 'src/services/portal.service';
import { ModalController } from '@ionic/angular';
import { ModalCrearFuncionarioPage } from '../../models/modal-crear-funcionario/modal-crear-funcionario.page';
import { IONIC_COMPONENTS } from '../../imports/ionic-imports';
import { ModalEditarFuncionarioPage } from 'src/app/models/modal-editar-funcionario/modal-editar-funcionario.page';

@Component({
  selector: 'app-listado-colaboradores',
  templateUrl: './listado-colaboradores.page.html',
  styleUrls: ['./listado-colaboradores.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListadoColaboradoresPage implements OnInit {
  param:any;
  funcionarios:any[]=[];
  empleadoForm: FormGroup = new FormGroup({});
  pageSize = 10; // Tamaño por página (10, 50, 100)
  currentPage = 1;
  esPC: boolean | undefined;

  constructor(private service:PortalService, 
    private moduleService:ModuleService, 
    private modalController: ModalController,
    private fb: FormBuilder,
  ) 
    {addIcons({ pencil, eye, close, add}); 
  
  }

  async ngOnInit() {
    this.param=this.moduleService.getParam();
    await this.colaboradores()
  }

  async colaboradores() {
    this.param.estado_Proceso = this.param.estado_Proceso.replaceAll(';', ',');
    this.service.getColaboradores(this.param.estado_Proceso,this.param.ciudad).subscribe({
      next:async(resp)=>{
        try{
          console.log("Respuesta Login: ", resp)
          this.funcionarios=resp.data.datos.listadoColaboradores
        }catch(error){
          console.error("Respuesta Login: ", error)
        }
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

  formCrear(){
    return this.empleadoForm = this.fb.group({
      ID: [0, Validators.required],
      ID_TIPO_REGISTRO: [, Validators.required],
      TIPO_IDENTIFICACION : [, [Validators.required, Validators.maxLength(50)]],
      IDENTIFICACION : ['', [Validators.required, Validators.maxLength(50)]],
      NOMBRES : ['', [Validators.required, Validators.maxLength(50)]],
      APELLIDOS : ['', [Validators.required, Validators.maxLength(50)]],
      GENERO : ['', [Validators.required, Validators.maxLength(1)]],
      RH : ['', [Validators.required, Validators.maxLength(3)]],
      FECHA_NACIMIENTO : ['', Validators.required],
      ID_NIVEL_EDUCATIVO : [0, Validators.required],
      ID_PROFESION : [[]],
      ID_PROFESION_ESCOGIDA: [''],
      ENTIDAD_PREGRADO: [''],
      ID_POSTGRADO: [[]],
      ID_POSTGRADO_ESCOGIDA: [''],
      TELEFONO_CELULAR : ['', [Validators.required, Validators.maxLength(11)]],
      CIUDAD_RESIDENCIA : ['', [Validators.required, Validators.maxLength(50)]],
      DIRECCION_RESIDENCIA : ['', [Validators.required, Validators.maxLength(100)]],
      TIENE_HIJOS : [, [Validators.required, Validators.maxLength(1)]],
      NOMBRE_CONTACTO : ['', [Validators.required, Validators.maxLength(100)]],
      TELEFONO_CONTACTO: ['', [Validators.required, Validators.maxLength(11)]],
      FECHA_INGRESO : ['', Validators.required],
      ID_EMPRESA : [, Validators.required],
      CIUDAD_TRABAJO : [''],
      ID_SEDE : [],
      ID_GERENCIA : [],
      ID_AREA : [],
      ID_CARGO : [],
      ID_TIPO_NOMINA : [],
      ID_ROL : [],
      ID_TIPO_DOTACION : [],
      ID_NIVEL_DOTACION : [],
      ENTIDAD_POSTGRADO: [''],
      CORREO_PERSONAL : ['', [Validators.required, Validators.email]],
      CORREO_CORPORATIVO: ['', Validators.email],
      PAZ_SALVO_ACTIVOS: [''],
      ENTREGA_TARJETA_INGRESO: [''],
      CAMBIO_CARGO: [''],
      FECHA_ACTUALIZACION: ['', Validators.required],
      ESTADO: [],
      ARL : ['', Validators.required],
      ID_ESTADO_CIVIL : [, Validators.required],
      ID_JEFE : [, Validators.required],
      HIJOS_COLABORADOR_JSON: this.fb.array([]) // Para agregar hijos dinámicamente
    });
  }

  async abrirModalCrearFuncionario() {
    const modal = await this.modalController.create({
      component: ModalCrearFuncionarioPage,
      componentProps: { empleadoForm: this.formCrear() }
    });

    modal.style.cssText = `
    --height: 90%;
    --max-height: 90%;
    --width: 90%;
    --max-width: 90%;
    --border-radius: 10px;
  `;
    return await modal.present();
  }

  async abrirModalEditarFuncionario(id:number, editar:boolean) {
    const modal = await this.modalController.create({
      component: ModalEditarFuncionarioPage,
      componentProps: { idColaborador: id, editar: editar}
    });

    modal.style.cssText = `
    --height: 90%;
    --max-height: 90%;
    --width: 90%;
    --max-width: 90%;
    --border-radius: 10px;
  `;
    return await modal.present();
  }

  async Inactivar(data:any){
    const datos = {
      IDENTIFICACION: Number(data.identificacion),
      RESPONSABLE:Number(this.param.identificacion),
      ID_USUARIO: data.id,
      OBSERVACION: "prueba"
    }
    this.service.putInactivarUsuario(datos).subscribe({
      next: async (resp) => {
        try {
          console.log("Respuesta:", resp);
          await this.colaboradores()
        } catch (error) {
          console.error("Error al procesar respuesta:", error);
        }
      },
      error: (err) => {
        console.error("Error al enviar formulario:", err);
      }
    });

  }

}
