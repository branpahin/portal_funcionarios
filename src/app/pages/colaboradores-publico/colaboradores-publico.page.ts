import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PortalService } from 'src/services/portal.service';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { ModalInfoColaboradorPage } from 'src/app/models/modal-info-colaborador/modal-info-colaborador.page';
import { UserInteractionService } from 'src/services/user-interaction-service.service';
import { createApplication } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-colaboradores-publico',
  templateUrl: './colaboradores-publico.page.html',
  styleUrls: ['./colaboradores-publico.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ColaboradoresPublicoPage implements OnInit {

  form: FormGroup;
  colaboradores:any;
  url: boolean = true;

  constructor(private fb: FormBuilder, 
    private service:PortalService,
    private modalController: ModalController,
    private UserInteractionService: UserInteractionService,
    private route: ActivatedRoute) {
    this.form = this.fb.group({
      nombre: [''],
      cedula: [],
      guia:['cedula',]
    });
  }

  ngOnInit() {
    this.url==true
    this.route.paramMap.subscribe(params => {
      const cedula = params.get('cedula') ?? undefined;
      console.log(cedula)
      if (cedula!=undefined) {
        this.url=true
        this.URLBuscar(cedula);
      }else{
        this.url=false
      }
    });
  }

  selec(dato:string){
    this.form.patchValue({
      guia: dato
    })
  }

  async buscar(credentials: any) {
    if(credentials.cedula!=null){
      this.UserInteractionService.showLoading('Consultando...');
      this.service.postConsultarColaborador(credentials).subscribe({
        next:async(resp)=>{
          try{
            console.log("resp: ",resp)
            this.UserInteractionService.dismissLoading();
            this.abrirModalInfoColaborador(resp.body.data.datos);
          }catch(error){
            console.error("Respuesta Login: ", error)
            this.UserInteractionService.dismissLoading();
          }
        },error:(err)=>{
          this.UserInteractionService.dismissLoading();
          this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
        }

      })
    }else{
      this.UserInteractionService.presentToast('Campo cedula requerido');
    }

  }

  async URLBuscar(cedula:string){
    const credentials={
      cedula: Number(cedula)
    }
    if(credentials.cedula!=null){
      this.UserInteractionService.showLoading('Consultando...');
      this.service.getConsultarColaboradorCedula(credentials).subscribe({
        next:async(resp)=>{
          try{
            console.log("resp: ",resp)
            this.UserInteractionService.dismissLoading();
            this.abrirModalInfoColaborador(resp.data.datos);
          }catch(error){
            console.error("Respuesta Login: ", error)
            this.UserInteractionService.dismissLoading();
          }
        },error:(err)=>{
          this.UserInteractionService.dismissLoading();
          this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
        }

      })
    }else{
      this.UserInteractionService.presentToast('Campo cedula requerido');
    }
  }

    async abrirModalInfoColaborador(data:any) {
      const modal = await this.modalController.create({
        component: ModalInfoColaboradorPage,
        componentProps: { colaborador: data},
        backdropDismiss: !this.url,
        canDismiss: !this.url
      });
  
      modal.style.cssText = `
      --border-radius: 10px;
    `;
      return await modal.present();
    }

}
