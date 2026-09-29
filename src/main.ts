import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withHashLocation } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import "@angular/compiler";
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { importProvidersFrom } from '@angular/core';
import { addIcons } from 'ionicons';
import { close, card, cog, desktopOutline, documentText, eye, home, lockClosed, logOut, moon, person, phonePortraitOutline, receiptOutline, search, sunny, helpCircle, call, mail, closeCircleOutline, checkmarkCircleOutline, refreshOutline, hourglassOutline, checkmarkOutline, pencil, add, swapVertical, swapVerticalOutline, funnelOutline, chevronUpOutline, chevronDownOutline, checkmarkCircle, caretDownOutline, key, checkmarkDoneCircleOutline, downloadOutline, personAdd, idCardOutline, personCircleOutline, documents, createOutline, documentOutline, documentTextOutline, arrowForwardOutline, mailUnreadOutline, businessOutline, returnDownForwardOutline, calendarOutline, chevronForwardCircle, trash, text, informationCircleOutline, closeOutline, codeOutline, imageOutline, trainOutline, mailOpenOutline, eyeOutline } from 'ionicons/icons';

addIcons({
  'phone-portrait-outline': phonePortraitOutline,
  'receipt-outline': receiptOutline,
  'desktop-outline': desktopOutline,
  'person': person,
  'person-circle-outline':personCircleOutline,
  'person-add':personAdd,
  'lock-closed': lockClosed,
  'eye': eye,
  'search':search,
  'card':card,
  'key':key,
  'document-text':documentText,
  'documents':documents,
  'log-out-outline':logOut,
  'sunny':sunny,
  'moon':moon,
  'home' : home,
  'cog' : cog,
  'close': close,
  'help-circle': helpCircle,
  'create-outline':createOutline,
  'document-text-outline':documentTextOutline,
  'arrow-forward-outline':arrowForwardOutline,
  'mail-unread-outline':mailUnreadOutline,
  'mail-open-outline':mailOpenOutline,
  'call': call,
  'mail':mail,
  'close-circle-outline':closeCircleOutline,
  'close-outline':closeOutline,
  'checkmark-circle-outline':checkmarkCircleOutline,
  'refresh-outline': refreshOutline,
  'hourglass-outline': hourglassOutline,
  'checkmark-outline':checkmarkOutline,
  'pencil': pencil,
  'add': add,
  'swap-vertical-outline': swapVerticalOutline, 
  'chevron-up-outline': chevronUpOutline,
  'chevron-down-outline': chevronDownOutline,
  'chevron-forward-outline':chevronForwardCircle,
  'checkmark-circle': checkmarkCircle,
  'caret-down-outline': caretDownOutline,
  'checkmark-donde-circle-outline': checkmarkDoneCircleOutline,
  'download':downloadOutline,
  'id-card-outline':idCardOutline,
  'business-outline': businessOutline,
  'return-down-forward-outline': returnDownForwardOutline,
  'calendar-outline': calendarOutline,
  'trash':trash,
  'text':text,
  'information-circle-outline':informationCircleOutline,
  'code-outline':codeOutline,
  'image-outline':imageOutline,
  'trash-outline': trainOutline,
  'eye-outline':eyeOutline,


});


bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    importProvidersFrom(IonicModule),
    provideRouter(routes, withPreloading(PreloadAllModules), withHashLocation()),
    provideHttpClient()
  ],
});
