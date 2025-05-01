import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pencil } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';
import { ModuleService } from 'src/services/modulos/module.service';
import { IONIC_COMPONENTS } from '../../imports/ionic-imports';

@Component({
  selector: 'app-actualizacion-filtros',
  templateUrl: './actualizacion-filtros.page.html',
  styleUrls: ['./actualizacion-filtros.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActualizacionFiltrosPage implements OnInit {
  param:any;
  tipoFiltro: string = '';
  filtros:any[]=[];
  pageSize = 10; // Tamaño por página (10, 50, 100)
  currentPage = 1;
  constructor(private route: ActivatedRoute, private moduleService:ModuleService) { addIcons({ pencil}); }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.tipoFiltro = params['tipo'];
    });
    this.param=this.moduleService.getFiltros();
    this.filtros = this.param[this.tipoFiltro]
    
  }

  get totalPages(): number {
    return Math.ceil(this.filtros.length / this.pageSize);
  }

  get paginatedFuncionarios() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtros.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }


}
