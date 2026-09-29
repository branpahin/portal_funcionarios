import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';

@Component({
  selector: 'app-modal-vista-previa',
  templateUrl: './modal-vista-previa.page.html',
  styleUrls: ['./modal-vista-previa.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IONIC_COMPONENTS
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalVistaPreviaPage  {

  @Input() html = '';
  constructor(
    private modalController: ModalController
  ) {}

  async cerrar(): Promise<void> {
    await this.modalController.dismiss();
  }
}