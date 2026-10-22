import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { ModalController } from '@ionic/angular';
import { PortalService } from 'src/services/portal.service';

@Component({
  selector: 'app-componente-busqueda',
  templateUrl: './componente-busqueda.component.html',
  styleUrls: ['./componente-busqueda.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IONIC_COMPONENTS],
})
export class ComponenteBusquedaComponent {
  @Input() label: string = 'Seleccione';
  @Input() options: any[] = [];
  @Input() selec: any[] = [];
  @Input() displayProperty: string = 'nombre'; // propiedad a mostrar
  @Input() multiple: boolean = false;
  @Input() multipleLista: boolean = false;
  @Input() placeholder: string = 'Buscar...';

  @Output() seleccion = new EventEmitter<any | any[]>();

  searchText: string = '';
  selectedItems: any[] = [];
  subApisPorId: { [id: string]: any[] } = {};
  cargandoSubApis: { [id: string]: boolean } = {};
  apisExpandidas: { [id: string]: boolean } = {};
  constructor(private modalCtrl: ModalController, private services:PortalService) {}

  get filteredOptions() {
    return this.options.filter(op =>
      op[this.displayProperty].toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  async ngOnInit() {
    console.log(this.multipleLista)
    console.log(this.selec)
    if(!this.multiple){
      this.selectedItems = [this.selec];
    }else{
      for(let data of this.selec){
        this.selectedItems.push(data);
        if(this.multipleLista){
          this.consultarSubApis(data)
        }
      }
    }
  }

  consultarSubApis(api: any) {
    const id = String(api.id);

    // Mostrar las subAPI debajo de esta API.
    this.apisExpandidas[id] = true;

    // Evitar repetir la petición si ya se consultaron.
    if (
      this.subApisPorId[id] !== undefined ||
      this.cargandoSubApis[id]
    ) {
      return;
    }

    this.cargandoSubApis[id] = true;

    this.services.getGetAplicativos(api.id).subscribe({
      next: (resp: any) => {
        this.subApisPorId[id] =
          resp?.data?.datos?.aplicativos ?? [];

        this.cargandoSubApis[id] = false;
      },
      error: (err: any) => {
        this.subApisPorId[id] = [];
        this.cargandoSubApis[id] = false;

        console.error(
          err?.error?.data?.error ??
          'Error al consultar las subAPI.'
        );
      }
    });
  }

  toggleSelect(item: any) {
    if (!this.multiple) {
      this.selectedItems = [item];
      this.seleccion.emit(item);
      this.modalCtrl.dismiss(item);
      return;
    }

    const index = this.selectedItems.findIndex(
      sel => sel.id === item.id
    );

    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);

      // Si está habilitada la selección jerárquica,
      // consultar las subAPI de la API seleccionada.
      if (this.multipleLista) {
        this.consultarSubApis(item);
      }
    }

    this.seleccion.emit(this.selectedItems);
  }

  toggleSubApi(subApi: any) {
    const index = this.selectedItems.findIndex(
      sel => sel.id === subApi.id
    );

    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(subApi);
    }

    this.seleccion.emit(this.selectedItems);
  }

  isSelected(item: any): boolean {
    if(this.multipleLista){
      return this.selectedItems.some(sel => sel.id === item.id);
    }
    return this.selectedItems.includes(item);
  }

  confirmarSeleccion() {
    this.modalCtrl.dismiss(this.selectedItems);
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

}
