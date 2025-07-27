import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PortalService } from 'src/services/portal.service';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { ModalInfoColaboradorPage } from 'src/app/models/modal-info-colaborador/modal-info-colaborador.page';
import { UserInteractionService } from 'src/services/user-interaction-service.service';

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

  constructor(private fb: FormBuilder, 
    private service:PortalService,
    private modalController: ModalController,
    private UserInteractionService: UserInteractionService) {
    this.form = this.fb.group({
      nombre: [''],
      cedula: [],
      guia:['cedula',]
    });
  }

  ngOnInit() {
    this.service.getConsultarColaboradores().subscribe({
      next:async(resp)=>{
        try{
          this.colaboradores=resp.data.datos.nombres_Colaboradores;
        }catch(error){
          console.error("Respuesta Login: ", error)
        }
      }
    })
  }

  selec(dato:string){
    this.form.patchValue({
      guia: dato
    })
  }

  async buscar(credentials: any) {
    if(credentials.cedula==null){
      credentials.cedula=0
    }
    
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
        this.UserInteractionService.presentToast(err);
      }

    })
  }

    async abrirModalInfoColaborador(data:any) {
      const modal = await this.modalController.create({
        component: ModalInfoColaboradorPage,
        componentProps: { colaborador: data}
      });
  
      modal.style.cssText = `
    
      --max-height: 90%;
     
      --max-width: 90%;
      --border-radius: 10px;
    `;
      return await modal.present();
    }

}
