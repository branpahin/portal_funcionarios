import { Component, OnInit,CUSTOM_ELEMENTS_SCHEMA, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PortalService } from 'src/services/portal.service';
import { ModuleService } from 'src/services/modulos/module.service';
import { HttpClient } from '@angular/common/http';
import { UserInteractionService } from 'src/services/user-interaction-service.service';
import { Router } from '@angular/router';
import { SecureStorageService } from 'src/services/secure-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  
})
export class LoginPage implements OnInit {
  form: FormGroup;
  private router = inject(Router)
  constructor(private fb: FormBuilder, private service:PortalService, private moduleService:ModuleService, 
    private UserInteractionService: UserInteractionService) { 
    this.form = this.fb.group({
      usuario_equipo: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}
  
  async login(credentials: any) {
    this.UserInteractionService.showLoading('Ingresando...');
    this.service.postLogin(credentials).subscribe({
      next:async(resp)=>{
        try{
          const token = resp.headers?.get('authorization');
          console.log("resp: ",resp)
          resp.body.data
          this.moduleService.setParam(resp.body.data)
          if (token) {
            localStorage.setItem('token', token); // Guardar el token en localStorage
            await this.router.navigate(['/layout']); // Redirigir al módulo home
          }
          this.UserInteractionService.dismissLoading()
        }catch(error){
          console.error("Respuesta Login: ", error)
          this.UserInteractionService.dismissLoading()
          this.UserInteractionService.presentToast('problemas al ingresar')
        }
      },
      error: async (error) => {
          console.error('Error al crear la transacción:', error);
          await this.UserInteractionService.dismissLoading();
          
          const mensaje = error?.error?.mensaje|| 'Ocurrió un error inesperado.';
          await this.UserInteractionService.presentToast( mensaje);
      },
    })
  }

}
