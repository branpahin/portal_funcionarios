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
  selector: 'app-modal-crear-filtro',
  templateUrl: './modal-crear-filtro.page.html',
  styleUrls: ['./modal-crear-filtro.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, ErrorMensajeComponent, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalCrearFiltroPage implements OnInit {
  @Input() data: any | string;
  @Input() editar: boolean|undefined;
  filtroForm: FormGroup = new FormGroup({});
  param:any;
  constructor(private service:PortalService, private modalCtrl: ModalController, 
    private fb: FormBuilder, private moduleService:ModuleService, private UserInteractionService: UserInteractionService,
    public permisosService: PermisosService) {
      addIcons({ pencil, eye, close, add}); 
      this.formulario();
    }

  async ngOnInit() {
    this.param=this.moduleService.getFiltros();
    console.log("usuario: ",this.data)
    if(this.data && this.editar==true){
      this.filtroForm.patchValue({
        id: Number(this.data.id),
        descripcion: this.data.descripcion,
        campo: this.data.campo,
        estado: this.data.estado,
      })
    }else{
      this.filtroForm.patchValue({
        campo: this.data,
      })
    }
  }

  formulario(){
    this.filtroForm = this.fb.group({
      id: [null, Validators.required], 
      descripcion: ['', Validators.required], 
      campo: ['', Validators.required], 
      estado: ['', [Validators.required, Validators.maxLength(1)]], 
    });
  }

  guardarFiltro(){
    this.UserInteractionService.showLoading('Guardando...');
    
    console.log('editar: ',this.editar)
    if(this.editar==false){
      this.filtroForm.removeControl('id');
    }
    const formValue = this.filtroForm.value;
    console.log("formValue: ",formValue)
  
    if(!this.editar){
      this.service.postCrearFiltroDet(formValue).subscribe({
        next: async (resp) => {
          try {
            console.log("Respuesta:", resp);
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
          this.UserInteractionService.presentToast(err)
          this.cerrarModal();
        }
      });
    }else{
      this.service.putActualzarFiltroDet(formValue).subscribe({
        next: async (resp) => {
          try {
            console.log("Respuesta:", resp);
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
          this.UserInteractionService.presentToast(err)
          this.cerrarModal();
        }
      });
    }
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }
}
