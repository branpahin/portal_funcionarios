import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import "@angular/compiler";
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { importProvidersFrom } from '@angular/core';
import { addIcons } from 'ionicons';
import { close, card, cog, desktopOutline, documentText, eye, home, lockClosed, logOut, moon, person, phonePortraitOutline, receiptOutline, search, sunny, helpCircle, call, mail, closeCircleOutline, checkmarkCircleOutline, refreshOutline, hourglassOutline, checkmarkOutline, pencil, add, swapVertical, swapVerticalOutline, funnelOutline, chevronUpOutline, chevronDownOutline, checkmarkCircle, caretDownOutline } from 'ionicons/icons';

addIcons({
  'phone-portrait-outline': phonePortraitOutline,
  'receipt-outline': receiptOutline,
  'desktop-outline': desktopOutline,
  'person': person,
  'lock-closed': lockClosed,
  'eye': eye,
  'search':search,
  'card':card,
  'document-text':documentText,
  'log-out-outline':logOut,
  'sunny':sunny,
  'moon':moon,
  'home' : home,
  'cog' : cog,
  'close': close,
  'help-circle': helpCircle,
  'call': call,
  'mail':mail,
  'close-circle-outline':closeCircleOutline,
  'checkmark-circle-outline':checkmarkCircleOutline,
  'refresh-outline': refreshOutline,
  'hourglass-outline': hourglassOutline,
  'checkmark-outline':checkmarkOutline,
  'pencil': pencil,
  'add': add,
  'swap-vertical-outline': swapVerticalOutline,
  'chevron-up-outline': chevronUpOutline,
  'chevron-down-outline': chevronDownOutline,
  'checkmark-circle': checkmarkCircle,
  'caret-down-outline': caretDownOutline

});


bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    importProvidersFrom(IonicModule),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient()
  ],
});
