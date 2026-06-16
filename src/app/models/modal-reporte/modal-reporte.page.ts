import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { PortalService } from 'src/services/portal.service';
import { ModuleService } from 'src/services/modulos/module.service';

@Component({
  selector: 'app-modal-reporte',
  templateUrl: './modal-reporte.page.html',
  styleUrls: ['./modal-reporte.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalReportePage {
  @Input() estados_Proceso: any[] = [];

  searchField = 'Nombres';
  searchText: string | number = '';

  filtrosAplicados: any[] = [];

  constructor(
    private modalController: ModalController
  ) {}

  agregarFiltro() {

    if (
      this.searchText === null ||
      this.searchText === undefined ||
      this.searchText === ''
    ) {
      return;
    }

    const index = this.filtrosAplicados.findIndex(
      x => x.campo === this.searchField
    );

    if (index >= 0) {

      this.filtrosAplicados[index].valor =
        this.searchText;

    } else {

      this.filtrosAplicados.push({
        campo: this.searchField,
        valor: this.searchText
      });

    }

    this.searchText = '';
  }

  eliminarFiltro(filtro: any) {

    this.filtrosAplicados =
      this.filtrosAplicados.filter(
        x => x !== filtro
      );
  }

  limpiarFiltros() {

    this.filtrosAplicados = [];
  }

  generar() {

    const filters: Record<string, any[]> = {};

    this.filtrosAplicados.forEach(filtro => {

      filters[filtro.campo] = [
        {
          value: filtro.valor,
          matchMode:
            filtro.campo === 'Estado'
              ? 'equals'
              : 'contains',
          operator: 'and'
        }
      ];

    });

    this.modalController.dismiss(filters);
  }

  cancelar() {
    this.modalController.dismiss();
  }
}