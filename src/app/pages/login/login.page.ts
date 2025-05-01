import { Component, OnInit,CUSTOM_ELEMENTS_SCHEMA, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PortalService } from 'src/services/portal.service';
import { ModuleService } from 'src/services/modulos/module.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  constructor(private fb: FormBuilder, private service:PortalService, private moduleService:ModuleService) { 
    this.form = this.fb.group({
      usuario_equipo: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}
  
  async login(credentials: any) {
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
        }catch(error){
          console.error("Respuesta Login: ", error)
        }
      }
    })
  }

}
