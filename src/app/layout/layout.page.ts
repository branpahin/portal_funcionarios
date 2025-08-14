import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenu, IonMenuButton, IonIcon, IonSelect, IonSelectOption} from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, person, people, chevronDown, chevronForward, options, filter, close, logOut, chevronUp, chevronBack } from 'ionicons/icons';
import { environment } from 'src/environments/environment';
import { PortalService } from 'src/services/portal.service';
import { ModuleService } from 'src/services/modulos/module.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonSelect, IonSelectOption, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenu,IonMenuButton,RouterModule,IonIcon, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  
})
export class LayoutPage implements OnInit {
  param:any;
  filtros:any;
  filtroKeys:any;
  rolesSelec:any;
  rolSeleccionado: number | null = null;
  version = environment.version;
  filtrosAbiertos = false;
  isHome = false;
  constructor(private service:PortalService, 
    private moduleService:ModuleService,
    private router: Router,
    private cdr: ChangeDetectorRef) {addIcons({ home, people, person, chevronDown, chevronUp, chevronBack, options, filter}); this.params()
  this.router.events.subscribe(() => {
      this.isHome = this.router.url === '/layout/home';
    });}

  async ngOnInit() {
    console.log("this.isHome: ",this.isHome)
    await this.roles()
  }

  
  async params() {
    this.param=this.moduleService.getParam();
    console.log("params: ",this.param)
    this.service.getCaposFiltro().subscribe({
      next:async(resp)=>{
        try{
          // this.filtros=resp.data.datos;
          this.moduleService.setFiltros(resp.data.datos)
          // this.filtroKeys = Object.keys(this.filtros);
        }catch(error){
          console.error("Respuesta Login: ", error)
        }
      }
    })

    this.service.getNombresFiltros().subscribe({
      next:async(resp)=>{
        try{
          console.log("datos: ",resp)
          this.filtros=resp.data.datos.nombres_Filtros;
          // this.moduleService.setFiltros(resp.data.datos)
          this.filtroKeys = this.filtros;
        }catch(error){
          console.error("Respuesta Login: ", error)
        }
      }
    })
  }

  async roles(){
    this.service.getRolesUsuario().subscribe({
      next:async(data)=>{
        try {
          const resp=data.data.rolesUsuario
          console.log("resp: ",resp)
          this.rolesSelec=resp
          this.rolSeleccionado=resp[0].id

        } catch (error) {
          console.error("Error en listarUsuarios:", error);
        }
      },
      error: (err) => {
        console.error("Error al obtener usuarios:", err);
      }
    })
  }

  toggleFiltros() {
    this.filtrosAbiertos = !this.filtrosAbiertos;
  }

  actualizarFiltros(tipo: string) {
    this.router.navigate(['/layout/actualizacion-filtros'], {
      queryParams: { tipo: tipo},
    }).then(() => {
      location.reload();
    });
    
  }

  logout(){
    this.router.navigate(['/login'], {}).then(() => {
      localStorage.clear();
    });
  }

}
