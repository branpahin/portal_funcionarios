import { HttpClientModule } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})


export class AppComponent {
  constructor() {}
}
