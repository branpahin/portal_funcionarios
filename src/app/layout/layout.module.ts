import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LayoutPage } from './layout.page';
import { LayoutRoutingModule } from './layout-routing.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LayoutRoutingModule,
    LayoutPage 
  ]
})
export class LayoutModule { }
