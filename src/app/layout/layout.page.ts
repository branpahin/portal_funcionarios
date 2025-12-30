import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenu, IonMenuButton, IonIcon, IonSelect, IonSelectOption} from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, person, people, chevronDown, chevronForward, options, filter, close, logOut, chevronUp, chevronBack } from 'ionicons/icons';
import { environment } from 'src/environments/environment';
import { PortalService } from 'src/services/portal.service';
import { ModuleService } from 'src/services/modulos/module.service';
import { PermisosService } from 'src/services/permisos.service';
import { UserInteractionService } from 'src/services/user-interaction-service.service';
import { ModalEditarFuncionarioPage } from '../models/modal-editar-funcionario/modal-editar-funcionario.page';
import { ModalController } from '@ionic/angular';
import { MenuStateService } from 'src/services/menu-state.service';
import { SecureStorageService } from 'src/services/secure-storage.service';

interface MenuItem {
  name: string
  href: string
  icon: string
  accion:string
  permisos:any
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonSelect, IonSelectOption, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenu,IonMenuButton,RouterModule,IonIcon, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  
})
export class LayoutPage implements OnInit {
  menuItems: MenuItem[] = []
  funcionarios:any[]=[];
  param:any;
  filtros:any;
  filtroKeys:any;
  permisosFiltros:any
  rolesSelec:any;
  rolSeleccionado: number | null = null;
  version = environment.version;
  filtrosAbiertos = false;
  isHome = false;
  isMobile = false;
  constructor(private service:PortalService, 
    private moduleService:ModuleService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private permisosService:PermisosService,
    private UserInteractionService: UserInteractionService,
    private modalController: ModalController,
    private menuState: MenuStateService,
    private secureStorage: SecureStorageService
  ) {addIcons({ home, people, person, chevronDown, chevronUp, chevronBack, options, filter}); this.params()
    this.router.events.subscribe(() => {
        this.isHome = this.router.url === '/layout/home';
      });}

  async ngOnInit() {
    console.log("this.isHome: ",this.isHome)
    await this.checkScreenSize();
    await this.roles()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  // 🛠️ Método para verificar el tamaño de la pantalla
  private checkScreenSize() {
    // 🖥️ Usa window.innerWidth para obtener el ancho actual
    this.isMobile = window.innerWidth <= 768; // 💡 Define tu punto de quiebre aquí
  }

  async colaboradores() {
    
    this.UserInteractionService.showLoading('Cargando...');
    console.log("this.param.estado_Proceso: ",this.param)
    this.param.estado_Proceso = this.param.estado_Proceso.replaceAll(';', ',');
    if(this.rolSeleccionado==2){
      this.service.getColaboradoresInterventor(this.rolSeleccionado).subscribe({
        next:async(resp)=>{
          try{
            console.log("Respuesta Colaboradores: ", resp)
            this.UserInteractionService.dismissLoading();
            this.funcionarios=resp.data.datos.listadoColaboradores
            this.secureStorage.set('colaboradores',this.funcionarios)
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
            console.log("Respuesta Colaboradores: ", resp)
            this.UserInteractionService.dismissLoading();
            this.funcionarios=resp.data.datos.listadoColaboradores
            this.secureStorage.set('colaboradores',this.funcionarios)
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

  
  async params() {
    this.param= await this.moduleService.getParam();
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
          this.secureStorage.set('rolSeleccionado',String(this.rolSeleccionado))
          await this.menu(this.rolSeleccionado!)
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

  async menu(rol:number){
    this.service.getMenu(rol).subscribe({
      next:async(data)=>{
        try {
          
          console.log("resp: ",data)
          const resp=data.data.menus
          this.menuItems = resp.map((item: any) => ({
            name: item.descripcion,
            href: item.controlador,
            icon: item.imagen,
            accion: item.accion,
            permisos: item.permisos
          }));
          this.menuState.setMenu(this.menuItems);

          await this.router.navigate(['/layout/home']);
          const colaboradoresItem = this.menuItems.find(
            (item) => item.href === '/layout/listado-colaboradores'
          );

          if (colaboradoresItem) {
            await this.colaboradores();
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

  toggleFiltros(data:any) {
    this.permisosFiltros = data
    console.log("permisosFiltros",this.permisosFiltros)
    this.permisosService.setPermisos(data);
    this.secureStorage.set('permisos',data)
    this.filtrosAbiertos = !this.filtrosAbiertos;
  }

  actualizarFiltros(tipo: string) {
    this.router.navigate(['/layout/actualizacion-filtros'], {
      queryParams: { tipo: tipo},
    }).then(() => {
      // location.reload();
    });
    
  }

  async abrirModalEditarFuncionario(id:number, editar:boolean, data:any) {
    this.permisosService.setPermisos(data);
    this.secureStorage.set('permisos',data)
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

  logout(){
    this.router.navigate(['/login'], {}).then(() => {
      localStorage.clear();
      location.reload();
    });
  }

}
