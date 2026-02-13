import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { ErrorMensajeComponent } from 'src/common/error-mensaje/error-mensaje.component';
import { ModalController } from '@ionic/angular';
import { ModalSearchPage } from 'src/app/models/modal-search/modal-search.page';
import { PortalService } from 'src/services/portal.service';
import { ModuleService } from 'src/services/modulos/module.service';
import { addIcons } from 'ionicons';
import { add, eye, pencil, close } from 'ionicons/icons';
import { UserInteractionService } from 'src/services/user-interaction-service.service';
import { TypeThemeColor } from 'src/app/enums/TypeThemeColor';
import { PermisosService } from 'src/services/permisos.service';

@Component({
  selector: 'app-creacion-usuario',
  templateUrl: './creacion-usuario.page.html',
  styleUrls: ['./creacion-usuario.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, ErrorMensajeComponent, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreacionUsuarioPage implements OnInit {
  @Input() usuario: any;
  @Input() editar: boolean|undefined;
  empleadoForm: FormGroup = new FormGroup({});
  funcionarios:any[]=[];
  param:any;
  ciudadTrabajo: any[] = [];
  empresas: any[] = [];
  roles_Usuario: any[] = [];
  estados_Proceso: any[] = [];
  cedulaSeleccionada: string = '';
  nombre: string ='';
  apellido: string ='';
  clave: string = '';
  constructor(private service:PortalService, private modalCtrl: ModalController, 
    private fb: FormBuilder, private moduleService:ModuleService, private UserInteractionService: UserInteractionService,
    public permisosService: PermisosService) {
      addIcons({ pencil, eye, close, add}); 
      this.formulario();
    }

  async ngOnInit() {
    //console.log("usuario: ",this.usuario)
    this.param= await this.moduleService.getFiltros();
    this.empleadoForm.get('ID_EMPRESA')?.valueChanges.subscribe(value => {
      this.selec('empresas');
    });
    this.empleadoForm.get('CIUDAD')?.valueChanges.subscribe(value => {
      this.selec('ciudadTrabajo');
    });
    this.empleadoForm.get('ROL')?.valueChanges.subscribe(value => {
      this.selec('roles_Usuario');
    });
    this.empleadoForm.get('ESTADO_PROCESO')?.valueChanges.subscribe(value => {
      this.selec('estados_Proceso');
    });
    //console.log("usuario: ",this.usuario)
    if(this.usuario){
      this.empleadoForm.patchValue({
        ID_EMPRESA: Number(this.usuario.empresa),
        IDENTIFICACION: this.usuario.identificacion,
        CIUDAD: this.usuario.ciudad
        ? this.usuario.ciudad.split(',').map((e:any) => +e.trim())
        : [],
        ROL: this.usuario.rol
        ? this.usuario.rol.split(',').map((e:any) => +e.trim())
        : [],
        ESTADO_PROCESO: this.usuario.estadO_PROCESO
        ? this.usuario.estadO_PROCESO.split(',').map((e:any) => +e.trim())
        : []
      })
      await this.listarUsuarios();
      await this.listarUsuariosSistema();
      
    }
  }

  formulario(){
    this.empleadoForm = this.fb.group({
      ID_EMPRESA: [null, Validators.required], // NUMBER
      IDENTIFICACION: [null, Validators.required], // NUMBER
      CIUDAD: ['', Validators.required],
      ROL: ['', [Validators.required, Validators.maxLength(30)]],
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
      //console.log("datos: ",data)
      this.nombre=data.nombres
      this.apellido=data.apellidos
      this.empleadoForm.patchValue({
        ID_EMPRESA: Number(data.iD_EMPRESA),
        IDENTIFICACION: data.identificacion,
        CIUDAD: [Number(data.ciudaD_TRABAJO)],
        ROL: data.rol,
        ESTADO_PROCESO: data.estadO_PROCESO,
      });
    }
  }

  async listarUsuarios(){
    this.service.getListarUsuariosAgregar().subscribe({
      next:async(data)=>{
        try {
          const resp=data.data.datos.listadoColaboradores
          //console.log("resp: ",resp)
          // Buscar coincidencia por cedula (identificacion)
          const coincidencia = resp.find((item: any) => item.identificacion === String(this.usuario.identificacion));

          if (coincidencia) {
            this.nombre = coincidencia.nombres;
            this.apellido = coincidencia.apellidos;
          } else {
            console.warn('⚠️ No se encontró coincidencia con la identificación:', this.usuario.identificacion);
          }

        } catch (error) {
          console.error("Error en listarUsuarios:", error);
        }
      },
      error: (err) => {
        console.error("Error al obtener usuarios:", err);
        this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
      }
    })
  }

  async listarUsuariosSistema(){
    this.service.getUsuariosSistema(this.usuario.id).subscribe({
      next:async(data)=>{
        try {
          this.clave = data.data.clave
          this.empleadoForm.patchValue({
            CLAVE:this.clave
          })

        } catch (error) {
          console.error("Error en listarUsuarios:", error);
        }
      },
      error: (err) => {
        console.error("Error al obtener usuarios:", err);
        this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
      }
    })
  }

  async selec(lista:string, dato?:string){
    this.param= await this.moduleService.getFiltros();
    if (lista === 'ciudadTrabajo') {
      this.ciudadTrabajo = this.param[lista] || [];
    } else if (lista === 'empresas') {
      this.empresas = this.param[lista] || [];
    } else if (lista === 'roles_Usuario') {
      this.roles_Usuario = this.param[lista] || [];
    } else if (lista === 'estados_Proceso') {
      this.estados_Proceso = this.param[lista] || [];
    }
    
  }

  guardarUsuario(){
    
    //console.log("formValue :",this.empleadoForm.value)
    if(this.empleadoForm.valid){
      this.UserInteractionService.showLoading('Guardando...');
      const formValue = this.empleadoForm.value;
      const payload = {
        ...formValue,
        CIUDAD: String(formValue.CIUDAD.join(',')),
        ESTADO_PROCESO: formValue.ESTADO_PROCESO.join(','),
        ROL: String(formValue.ROL.join(',')),
      };
      if(!this.editar){
        this.service.postCrearUsuario(payload).subscribe({
          next: async (resp) => {
            try {
              //console.log("Respuesta:", resp);
              this.UserInteractionService.dismissLoading()
              this.UserInteractionService.presentToast('Información guardada',TypeThemeColor.SUCCESS)
              this.cerrarModal();
            } catch (error) {
              console.error("Error al procesar respuesta:", error);
              this.UserInteractionService.dismissLoading()
              this.cerrarModal();
            }
          },
          error: (err) => {
            console.error("Error al enviar formulario:", err);
            this.UserInteractionService.dismissLoading()
            this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
            this.cerrarModal();
          }
        });
      }else{
        this.service.putActualizarUsuario(payload).subscribe({
          next: async (resp) => {
            try {
              //console.log("Respuesta:", resp);
              this.UserInteractionService.dismissLoading()
              this.UserInteractionService.presentToast('Actualización realizada',TypeThemeColor.SUCCESS)
              this.cerrarModal();
            } catch (error) {
              console.error("Error al procesar respuesta:", error);
              this.UserInteractionService.dismissLoading()
              this.cerrarModal();
            }
          },
          error: (err) => {
            console.error("Error al enviar formulario:", err);
            this.UserInteractionService.dismissLoading()
            this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
            this.cerrarModal();
          }
        });
      }
    }
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }
}
