import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent} from '@ionic/angular/standalone';
import { ModuleService } from 'src/services/modulos/module.service';
import { PermisosService } from 'src/services/permisos.service';
import { PortalService } from 'src/services/portal.service';
import { UserInteractionService } from 'src/services/user-interaction-service.service';
import { ModalEditarFuncionarioPage } from '../models/modal-editar-funcionario/modal-editar-funcionario.page';
import { ModalController } from '@ionic/angular';
import { MenuStateService } from 'src/services/menu-state.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface MenuItem {
  name: string
  href: string
  icon: string
  accion:string
  permisos:any
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule,RouterModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage {
  greetingMessage: string = '';
  homeMenuItems:any;
  menuSub: any;

  constructor(private service:PortalService, 
    private moduleService:ModuleService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private permisosService:PermisosService,
    private UserInteractionService: UserInteractionService,
    private modalController: ModalController,
    private menuState: MenuStateService) {}

  ngOnInit() {
    this.setGreetingMessage();
    this.menuSub = this.menuState.menuItems$.subscribe(menu => {

      this.homeMenuItems = menu.filter(item =>
        (item.accion === 'I' || item.href === '/layout/modal-editar-funcionario')
         && item.href !== '/layout/home'
        
      );

    });
  }

  ngOnDestroy() {
    if (this.menuSub) this.menuSub.unsubscribe();
  }

  setGreetingMessage() {
    const hour = new Date().getHours();

    if (hour < 12) this.greetingMessage = "☀️ Buenos días";
    else if (hour < 18) this.greetingMessage = "🌤️ Buenas tardes";
    else this.greetingMessage = "🌙 Buenas noches";
  }

  goTo(route: string) {
    // Aquí navegas a la página que quieras
    console.log("Navegar a:", route);
  }

  async abrirModalEditarFuncionario(id:number, editar:boolean, data:any) {
    this.permisosService.setPermisos(data);
    localStorage.setItem('permisos',JSON.stringify(data));
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
}
