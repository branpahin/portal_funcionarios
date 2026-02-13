import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ModuleService } from 'src/services/modulos/module.service';
import { PortalService } from 'src/services/portal.service';
import { ModalController } from '@ionic/angular';
import { ModalCrearFuncionarioPage } from '../../models/modal-crear-funcionario/modal-crear-funcionario.page';
import { IONIC_COMPONENTS } from '../../imports/ionic-imports';
import { ModalEditarFuncionarioPage } from 'src/app/models/modal-editar-funcionario/modal-editar-funcionario.page';
import { UserInteractionService } from 'src/services/user-interaction-service.service';
import { TypeThemeColor } from 'src/app/enums/TypeThemeColor';
import { IAlertAction } from 'src/interfaces/IAlertOptions';
import { PermisosService } from 'src/services/permisos.service';
import { SecureStorageService } from 'src/services/secure-storage.service';

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
  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  columnas = [
  { key: 'nombres', label: 'Nombre' },
  { key: 'identificacion', label: 'Cédula' },
  { key: 'telefonO_CELULAR', label: 'Teléfono' },
  { key: 'sede', label: 'Sede' },
  { key: 'cargo', label: 'Cargo' },
  { key: 'empresa', label: 'Empresa' },
  { key: 'gerencia', label: 'Gerencia' },
  { key: 'correO_CORPORATIVO', label: 'Correo' },
  { key: 'estadO_PROCESO', label: 'Estado de proceso' }
];

  constructor(private service:PortalService, 
    private moduleService:ModuleService, 
    private modalController: ModalController,
    private fb: FormBuilder,
    private UserInteractionService: UserInteractionService,
    private secureStorage: SecureStorageService,
    public permisosService: PermisosService,
  ) 
    {}

  async ngOnInit() {
    this.param= await this.moduleService.getParam();
    await this.colaboradores()
  }

  async colaboradores() {
    
    this.UserInteractionService.showLoading('Cargando...');
    //console.log("this.param.estado_Proceso: ",this.param)
    this.param.estado_Proceso = this.param.estado_Proceso.replaceAll(';', ',');
    const rol =  await this.secureStorage.get<number>('rolSeleccionado');
    if(rol==153){
      this.service.getColaboradoresInterventor(rol).subscribe({
        next:async(resp)=>{
          try{
            //console.log("Respuesta Colaboradores: ", resp)
            this.UserInteractionService.dismissLoading();
            this.funcionarios=resp.data.datos.listadoColaboradores
          }catch(error){
            console.error("Respuesta: ", error)
            this.UserInteractionService.dismissLoading();
          }
        },error:(err)=>{
          this.UserInteractionService.dismissLoading();
          this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
        }
      })
    }else{
      this.service.getColaboradores(this.param.estado_Proceso,this.param.ciudad).subscribe({
        next:async(resp)=>{
          try{
            //console.log("Respuesta Colaboradores: ", resp)
            this.UserInteractionService.dismissLoading();
            this.funcionarios=resp.data.datos.listadoColaboradores
          }catch(error){
            console.error("Respuesta: ", error)
            this.UserInteractionService.dismissLoading();
          }
        },error:(err)=>{
          this.UserInteractionService.dismissLoading();
          this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
        }
      })
    }
    
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

  async formCrear(){
    const rol =  await this.secureStorage.get<number>('rolSeleccionado');
    //console.log("rol: ",rol)
    if(rol == 153){
      return this.empleadoForm = this.fb.group({
        ID: [0, Validators.required],
        TIPO_IDENTIFICACION : [null, [Validators.required, Validators.maxLength(50)]],
        IDENTIFICACION : ['', [Validators.required, Validators.maxLength(50)]],
        NOMBRES : ['', [Validators.required, Validators.maxLength(50)]],
        APELLIDOS : ['', [Validators.required, Validators.maxLength(50)]],
        GENERO : ['', Validators.required],
        // ID_SEXO : [null,Validators.required],
        // ID_ORIENTACION_SEXUAL: [null,Validators.required],
        // ID_DISCAPACIDAD:[null,Validators.required],
        // ID_RAZA: ['', Validators.required],
        RH : ['', [Validators.required, Validators.maxLength(3)]],
        FECHA_NACIMIENTO : ['', Validators.required],
        ID_NIVEL_EDUCATIVO : [null, Validators.required],
        // ID_PROFESION : [[],Validators.required],
        // ENTIDAD_PREGRADO: ['',Validators.required],
        // ID_POSTGRADO: [[]],
        TELEFONO_CELULAR : ['', [Validators.required, Validators.maxLength(11)]],
        CIUDAD_RESIDENCIA : ['', [Validators.required, Validators.maxLength(50)]],
        DIRECCION_RESIDENCIA : ['', [Validators.required, Validators.maxLength(100)]],
        TIENE_HIJOS : [, [Validators.required, Validators.maxLength(1)]],
        NOMBRE_CONTACTO : ['', [Validators.required, Validators.maxLength(100)]],
        TELEFONO_CONTACTO: ['', [Validators.required, Validators.maxLength(11)]],
        FECHA_INGRESO : ['', Validators.required],
        ID_EMPRESA : [null, Validators.required],
        CIUDAD_TRABAJO : ['', Validators.required],
        ID_SEDE : [null, Validators.required],
        ID_GERENCIA : [null, Validators.required],
        // ID_CCO:[null, Validators.required],
        // ID_AREA : [null, Validators.required],
        // ID_RUBRO : [null, Validators.required],
        ID_CARGO : [null, Validators.required],
        // ID_TIPO_NOMINA : [null, Validators.required],
        // ID_ROL : [null, Validators.required],
        // ID_TIPO_DOTACION : [null, Validators.required],
        // ID_NIVEL_DOTACION : [null, Validators.required],
        // ENTIDAD_POSTGRADO: [''],
        CORREO_PERSONAL : ['', [Validators.required, Validators.email]],
        CORREO_CORPORATIVO: ['', Validators.email],
        FECHA_ACTUALIZACION: ['', Validators.required],
        ESTADO: [],
        ARL : ['', Validators.required],
        ID_ESTADO_CIVIL : [null, Validators.required],
        // ID_JEFE : [null, Validators.required],
        // HIJOS_COLABORADOR_JSON: this.fb.array([]) // Para agregar hijos dinámicamente
      });
    }else{
      return this.empleadoForm = this.fb.group({
        ID: [0, Validators.required],
        TIPO_IDENTIFICACION : [null, [Validators.required, Validators.maxLength(50)]],
        IDENTIFICACION : ['', [Validators.required, Validators.maxLength(50)]],
        NOMBRES : ['', [Validators.required, Validators.maxLength(50)]],
        APELLIDOS : ['', [Validators.required, Validators.maxLength(50)]],
        GENERO : ['', Validators.required],
        ID_SEXO : [null,Validators.required],
        ID_ORIENTACION_SEXUAL: [null,Validators.required],
        ID_DISCAPACIDAD:[null,Validators.required],
        ID_RAZA: ['', Validators.required],
        RH : ['', [Validators.required, Validators.maxLength(3)]],
        FECHA_NACIMIENTO : ['', Validators.required],
        ID_NIVEL_EDUCATIVO : [null, Validators.required],
        ID_PROFESION : [[],Validators.required],
        ENTIDAD_PREGRADO: ['',Validators.required],
        ID_POSTGRADO: [[]],
        TELEFONO_CELULAR : ['', [Validators.required, Validators.maxLength(11)]],
        CIUDAD_RESIDENCIA : ['', [Validators.required, Validators.maxLength(50)]],
        DIRECCION_RESIDENCIA : ['', [Validators.required, Validators.maxLength(100)]],
        TIENE_HIJOS : [, [Validators.required, Validators.maxLength(1)]],
        NOMBRE_CONTACTO : ['', [Validators.required, Validators.maxLength(100)]],
        TELEFONO_CONTACTO: ['', [Validators.required, Validators.maxLength(11)]],
        FECHA_INGRESO : ['', Validators.required],
        ID_EMPRESA : [null, Validators.required],
        CIUDAD_TRABAJO : ['', Validators.required],
        ID_SEDE : [null, Validators.required],
        ID_GERENCIA : [null, Validators.required],
        ID_CCO:[null, Validators.required],
        ID_AREA : [null, Validators.required],
        ID_RUBRO : [null, Validators.required],
        ID_CARGO : [null, Validators.required],
        ID_TIPO_NOMINA : [null, Validators.required],
        ID_ROL : [null, Validators.required],
        ID_TIPO_DOTACION : [null, Validators.required],
        ID_NIVEL_DOTACION : [null, Validators.required],
        ENTIDAD_POSTGRADO: [''],
        CORREO_PERSONAL : ['', [Validators.required, Validators.email]],
        CORREO_CORPORATIVO: ['', Validators.email],
        FECHA_ACTUALIZACION: ['', Validators.required],
        ESTADO: [],
        ARL : ['', Validators.required],
        ID_ESTADO_CIVIL : [null, Validators.required],
        ID_JEFE : [null, Validators.required],
        HIJOS_COLABORADOR_JSON: this.fb.array([]) // Para agregar hijos dinámicamente
      });
    }
  }

  async abrirModalCrearFuncionario() {
    const modal = await this.modalController.create({
      component: ModalCrearFuncionarioPage,
      componentProps: { empleadoForm: await this.formCrear() }
    });

    modal.style.cssText = `
    --height: 90%;
    --max-height: 90%;
    --width: 90%;
    --max-width: 90%;
    --border-radius: 10px;
  `;
    await modal.present();
    await modal.onWillDismiss();
    this.ngOnInit();
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
    await modal.present();
    await modal.onWillDismiss();
    this.ngOnInit();
  }

  async Inactivar(data:any){
    let action :IAlertAction[] =[
      {
        text: 'Cancelar',
        handler: async () => {
        }
      },
      {
        text: 'Aceptar',
        handler: async (d) => {
          const datos = {
            IDENTIFICACION: Number(data.identificacion),
            RESPONSABLE:Number(this.param.identificacion),
            ID_USUARIO: data.id,
            OBSERVACION: d.observacion
          }
          await this.inactivacionConfirmada(datos);
          this.UserInteractionService.presentToast('Usuario desactivado',TypeThemeColor.SUCCESS);
        }
      }
    ]
    this.UserInteractionService.presentAlertActions(
      '¡Se quiere inactivar el usuario!',
      action,
      false,
      'Notificación',
      [
        {
          name: 'observacion',
          type: 'textarea', 
          placeholder: 'Escriba su observación'
        }
      ]
    );

  }

  async inactivacionConfirmada(datos:any){
    const rol =  await this.secureStorage.get<number>('rolSeleccionado');
    if(rol == 153){
      this.UserInteractionService.showLoading('Guardando...');
      this.service.putInactivarUsuarioInterv(datos).subscribe({
        next: async (resp) => {
          try {
            //console.log("Respuesta:", resp);
            this.UserInteractionService.dismissLoading();
            this.UserInteractionService.presentToast('Inactivación realizada', TypeThemeColor.SUCCESS);
            await this.colaboradores();
          } catch (error) {
            console.error("Error al procesar respuesta:", error);
            this.UserInteractionService.dismissLoading();
          }
        },
        error: (err) => {
          console.error("Error al enviar formulario:", err);
          this.UserInteractionService.dismissLoading();
          this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
        }
      });
    }else{
      this.UserInteractionService.showLoading('Guardando...');
      this.service.putInactivarUsuario(datos).subscribe({
        next: async (resp) => {
          try {
            //console.log("Respuesta:", resp);
            this.UserInteractionService.dismissLoading();
            this.UserInteractionService.presentToast('Inactivación realizada', TypeThemeColor.SUCCESS);
            await this.colaboradores();
          } catch (error) {
            console.error("Error al procesar respuesta:", error);
            this.UserInteractionService.dismissLoading();
          }
        },
        error: (err) => {
          console.error("Error al enviar formulario:", err);
          this.UserInteractionService.dismissLoading();
          this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
        }
      });
    }
    
  }

  async activar(data:any){
    const actionObservacion: IAlertAction[] = [
      {
        text: 'Cancelar',
        handler: async () => {}
      },
      {
        text: 'Aceptar',
        handler: async (d) => {
          const observacion = d.observacion;

          // 👉 ahora lanzamos el segundo alert con los estados
          await this.mostrarAlertEstados(data, observacion);
        }
      }
    ];

    // Primer alert: observación
    this.UserInteractionService.presentAlertActions(
      '¡Se quiere activar el usuario!',
      actionObservacion,
      false,
      'Notificación',
      [
        {
          name: 'observacion',
          type: 'textarea',
          placeholder: 'Escriba su observación'
        }
      ]
    );
  }

  private async mostrarAlertEstados(data: any, observacion: string) {
    const filtros = await this.moduleService.getFiltros();
    const estados = filtros['estados_Proceso'] || [];

    const alertInputs = estados.map((e: any) => ({
      label: e.descripcion,
      type: 'radio',
      value: e.id
    }));

    const actionEstados: IAlertAction[] = [
      {
        text: 'Cancelar',
        handler: async () => {}
      },
      {
        text: 'Aceptar',
        handler: async (d) => {
          const datos = {
            IDENTIFICACION: Number(data.identificacion),
            RESPONSABLE: Number(this.param.identificacion),
            ID_USUARIO: data.id,
            OBSERVACION: observacion,
            ESTADO: d
          };
          await this.activacionConfirmada(datos);
          this.UserInteractionService.presentToast('Usuario activado', TypeThemeColor.SUCCESS);
        }
      }
    ];

    // Segundo alert: selección de estado
    this.UserInteractionService.presentAlertActions(
      'Seleccione el estado',
      actionEstados,
      false,
      'Estados',
      alertInputs
    );
  }

  async activacionConfirmada(datos:any){
    const rol =  await this.secureStorage.get<number>('rolSeleccionado');
    if(rol == 153){
      this.UserInteractionService.showLoading('Guardando...');
      this.service.putActivarColaboradorInterv(datos).subscribe({
        next: async (resp) => {
          try {
            //console.log("Respuesta:", resp);
            this.UserInteractionService.dismissLoading();
            this.UserInteractionService.presentToast('Activación realizada', TypeThemeColor.SUCCESS);
            await this.colaboradores();
          } catch (error) {
            console.error("Error al procesar respuesta:", error);
            this.UserInteractionService.dismissLoading();
          }
        },
        error: (err) => {
          console.error("Error al enviar formulario:", err);
          this.UserInteractionService.dismissLoading();
          this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
        }
      });
    }else{
      this.UserInteractionService.showLoading('Guardando...');
      this.service.putActivarColaborador(datos).subscribe({
        next: async (resp) => {
          try {
            //console.log("Respuesta:", resp);
            this.UserInteractionService.dismissLoading();
            this.UserInteractionService.presentToast('Activación realizada', TypeThemeColor.SUCCESS);
            await this.colaboradores();
          } catch (error) {
            console.error("Error al procesar respuesta:", error);
            this.UserInteractionService.dismissLoading();
          }
        },
        error: (err) => {
          console.error("Error al enviar formulario:", err);
          this.UserInteractionService.dismissLoading();
          this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
        }
      });
    }
    
  }

    async enviar(identificacion:string){
      let action2 :IAlertAction[] =[
        {
          text: 'Cancelar',
          handler: async () => {}
        }, 
        {
          text: 'Rechazar',
          handler: async (data) => {
            await this.aprobar(identificacion,data.observacion,'R');
            this.UserInteractionService.presentToast('Usuario editado con exito, pero no aprobado',TypeThemeColor.SUCCESS);
          }
        }
      ]

      let action :IAlertAction[] =[
        {
          text: 'Rechazar',
          handler: async () => {
            this.UserInteractionService.presentAlertActions(
            '¡Se ha realizado un cambio en el formulario!',
            action2)
          }
        },
        {
          text: 'Aprobar',
          handler: async (data) => {
            await this.aprobar(identificacion,data.observacion,'A');
            this.UserInteractionService.presentToast('Usuario editado con exito',TypeThemeColor.SUCCESS);
          }
        }
      ]
      this.UserInteractionService.presentAlertActions(
        '¡Se ha realizado un cambio en el formulario!',
        action,
        false,
        'Notificación',
        [
          {
            name: 'observacion',
            type: 'textarea', 
            placeholder: 'Escriba su observación'
          }
        ]
      );
    
    }
  
    async aprobar(identificacion:string,observacion:string, tipo:string){
      const data ={
        identificacion: Number(identificacion),
        observacion:observacion,
        tipo:tipo
      }
      this.service.postAprobarRechazarColaborador(data).subscribe({
          next: async (resp) => {
            try {
              //console.log("Respuesta:", resp);
              this.UserInteractionService.dismissLoading();
              this.ngOnInit();
            } catch (error) {
              console.error("Error al procesar respuesta:", error);
              this.UserInteractionService.dismissLoading();
            }
          },
          error: (err) => {
            console.error("Error al enviar formulario:", err);
            this.UserInteractionService.dismissLoading();
            this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
          }
        });
    }

}
