import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { ModalController } from '@ionic/angular';
import { PortalService } from 'src/services/portal.service';
import { IonFooter } from "@ionic/angular/standalone";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonFooter, CommonModule, FormsModule, ReactiveFormsModule, IONIC_COMPONENTS],
})
export class FooterComponent {
  

}
