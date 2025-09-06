import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { ModalController } from '@ionic/angular';

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
  @Input() placeholder: string = 'Buscar...';

  @Output() seleccion = new EventEmitter<any | any[]>();

  searchText: string = '';
  selectedItems: any[] = [];
  constructor(private modalCtrl: ModalController) {}

  get filteredOptions() {
    return this.options.filter(op =>
      op[this.displayProperty].toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  async ngOnInit() {
    if(!this.multiple){
      this.selectedItems = [this.selec];
    }else{
      console.log("seleccion:",this.selec)
      for(let data of this.selec)
      this.selectedItems.push(data);
    }
  }

  toggleSelect(item: any) {
    console.log("selecciona: ",this.selectedItems)
    if (this.multiple) {
      const index = this.selectedItems.findIndex(sel => sel === item);
      if (index > -1) this.selectedItems.splice(index, 1);
      else this.selectedItems.push(item);
      this.seleccion.emit(this.selectedItems);
    } else {
      this.selectedItems = [item];
      this.seleccion.emit(item);
      this.modalCtrl.dismiss(item);
    }
  }

  isSelected(item: any): boolean {
    return this.selectedItems.includes(item);
  }

  confirmarSeleccion() {
    this.modalCtrl.dismiss(this.selectedItems);
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

}
