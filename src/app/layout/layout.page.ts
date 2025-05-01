import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenu, IonMenuButton, IonIcon} from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, person, people, chevronDown, chevronForward, options, filter } from 'ionicons/icons';
import { environment } from 'src/environments/environment';
import { PortalService } from 'src/services/portal.service';
import { ModuleService } from 'src/services/modulos/module.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenu,IonMenuButton,RouterModule,IonIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  
})
export class LayoutPage implements OnInit {
  param:any;
  filtros:any;
  filtroKeys:any;
  version = environment.version;
  filtrosAbiertos = false;
  constructor(private service:PortalService, 
    private moduleService:ModuleService,
    private router: Router,
    private cdr: ChangeDetectorRef) {addIcons({ home, people, person, chevronDown, chevronForward, options, filter}); this.params()}

  ngOnInit() {
  }

  
  async params() {
    this.param=this.moduleService.getParam();
    console.log("params: ",this.param)
    this.service.getCaposFiltro().subscribe({
      next:async(resp)=>{
        try{
          this.filtros=resp.data.datos;
          this.moduleService.setFiltros(resp.data.datos)
          this.filtroKeys = Object.keys(this.filtros);
        }catch(error){
          console.error("Respuesta Login: ", error)
        }
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
