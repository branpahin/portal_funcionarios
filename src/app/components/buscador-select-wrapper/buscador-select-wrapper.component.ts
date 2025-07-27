import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ComponenteBusquedaComponent } from '../componente-busqueda/componente-busqueda.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';

@Component({
  selector: 'app-buscador-select-wrapper',
  templateUrl: './buscador-select-wrapper.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IONIC_COMPONENTS],
})
export class BuscadorSelectWrapperComponent {
  @Input() label: string = 'Seleccione';
  @Input() options: any[] = [];
  @Input() displayProperty: string = 'nombre';
  @Input() multiple: boolean = false;
  @Output() seleccion = new EventEmitter<any | any[]>();

  selectedItems: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  get displayText(): string {
    if (this.multiple) {
      return this.selectedItems.length > 0
        ? this.selectedItems.map(i => i[this.displayProperty]).join(', ')
        : 'Seleccionar';
    } else {
      return this.selectedItems[0]?.[this.displayProperty] || 'Seleccionar';
    }
  }

  async abrirModal() {
    console.log("this.options: ",this.options)
    const modal = await this.modalCtrl.create({
      component: ComponenteBusquedaComponent,
      componentProps: {
        label: this.label,
        options: this.options,
        displayProperty: this.displayProperty,
        multiple: this.multiple,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log("data: ",data)
      this.selectedItems = this.multiple ? data : [data];
      this.seleccion.emit(data);
    }
  }
}