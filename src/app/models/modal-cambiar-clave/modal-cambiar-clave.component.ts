import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-cambiar-clave',
  templateUrl: './modal-cambiar-clave.component.html',
  styleUrls: ['./modal-cambiar-clave.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
})
export class ModalCambiarClaveComponent {

  @Input() idUsuario: number = 0;
  formClave: FormGroup;

  constructor(private modalCtrl: ModalController, private fb: FormBuilder) {
    this.formClave = this.fb.group({
      claveAnterior: ['', Validators.required],
      claveNueva: ['', Validators.required],
    });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    if (this.formClave.valid) {
      const payload = {
        iD_USER: this.idUsuario,
        clavE_ANTERIOR: this.formClave.value.claveAnterior,
        clavE_NUEVA: this.formClave.value.claveNueva,
      };
      this.modalCtrl.dismiss(payload);
    }
  }
}
