import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { addIcons } from 'ionicons';
import { close, person} from 'ionicons/icons';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-info-colaborador',
  templateUrl: './modal-info-colaborador.page.html',
  styleUrls: ['./modal-info-colaborador.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ModalInfoColaboradorPage implements OnInit {
  @Input() colaborador: any;
  imagenPreview:string=''

  constructor(private modalCtrl: ModalController) {addIcons({ person, close} );}

  ngOnInit() {
    this.imagenPreview = `data:image/png;base64,${this.colaborador.foto}`;
  }
  cerrarModal() {
    this.modalCtrl.dismiss();
  }

}
