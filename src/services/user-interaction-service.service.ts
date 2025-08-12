import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { IAlertAction, IAlertRole } from '../interfaces/IAlertOptions';
import { TypeThemeColor } from '../app/enums/TypeThemeColor';

@Injectable({
  providedIn: 'root',
})
export class UserInteractionService {
  loaders: HTMLIonLoadingElement | null = null;
  showAlert = false;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {}

  /**
   * Presenta un alert controler y devuelve un rol, un rol es una clave que se retorna
   * al pulsar un boton y sirve para identificar la opción que se selecciono el usuario
   * @param header = encabezado del mensaje por defecto es notificación
   * @param message = texto del mensaje
   * @param actions = objeto que contiene la estructura requerida y esperada para armar los botones de opciones
   */
  async presentAlertActions(
    message: string,
    actions: IAlertAction[] = [
      {
        text: 'Ok',
        handler: () => {},
      },
    ],
    checkIsShowAlert = false,
    header: string = 'Notificación',
    inputs?: any[]
  ): Promise<HTMLIonAlertElement | void> {
    if ((checkIsShowAlert && !this.showAlert) || !checkIsShowAlert) {
      this.showAlert = true;

      const alert = await this.alertCtrl.create({
        backdropDismiss: false,
        header,
        message,
        buttons: actions,
        ...(inputs ? { inputs } : {})
      });

      alert.present();

      await alert.onDidDismiss().finally(() => {
        this.showAlert = false;
      });

      return alert;
    }
  }

  /**
   * Presenta un alert controler y devuelve un rol, un rol es una clave que se retorna
   * al pulsar un boton y sirve para identificar la opción que se selecciono el usuario
   * @param header = encabezado del mensaje por defecto es notificación
   * @param message = texto del mensaje
   * @param actions = objeto que contiene la estructura requerida y esperada para armar los botones de opciones
   */
  async presentAlertRoles(
    message: string,
    actions: IAlertRole[],
    checkIsShowAlert = false,
    header: string = 'Notificación'
  ): Promise<string | void> {
    if ((checkIsShowAlert && !this.showAlert) || !checkIsShowAlert) {
      const alert = await this.alertCtrl.create({
        backdropDismiss: false,
        header,
        message,
        buttons: actions,
      });

      await alert.present();

      await alert.onDidDismiss();

      const { role } = await alert
        .onDidDismiss()
        .finally(() => (this.showAlert = false));

      return role!;
    }
  }

  /**
   * Muestra Toast con los intentos de reconexión
   * @param message = texto del mensaje
   * @param color = nombre del color del sistema a asignar
   * @param duration = numero expresado en milisegundos
   */
  async presentToast(
    message: string,
    color: TypeThemeColor = TypeThemeColor.PRIMARY,
    duration = 6000
  ): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'top',
      color,
      cssClass: 'toast',
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {},
        },
      ],
    });
    toast.present();
  }

  /**
   * Presenta un componente modal
   * @param component = Componente que se va a cargar en el modal
   * @param properties = Se especifican los parametros de entrada al componente (@input) { 'propiedad1': valor1 }
   */
  async openModal(
    component: any,
    properties?: any,
  ): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: properties,
      cssClass: 'custom-modal',
      showBackdrop: true,
      backdropDismiss: true,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    return data;
  }

  /**
   * Presenta el control loading
   */
  async showLoading(message?: string): Promise<void> {
    if (this.loaders) return;

    await this.loadingCtrl
      .create({
        message: message,
        spinner: 'circular',
        translucent: true,
      })
      .then((loading) => {
        if (!this.loaders) {
          this.loaders = loading;
          this.loaders.present();
        }
      });
  }

  /**
   * Función que actualiza el mensaje de texto de un loading que se este mostrando en pantalla
   * @param newMessage Nuevo mensaje a mostrar
   */
  updateLoadingMessage(newMessage: string): void {
    //this._message.update(() => newMessage);
    if (this.loaders) {
      this.loaders.message = newMessage;
    }
  }

  /**
   * Dismiss all the pending loaders, if any
   */
  async dismissLoading(): Promise<void> {
    while (this.loaders) {
      try {
        await this.loaders
          .dismiss()
          .catch((e) => console.log(e))
          .finally(() => (this.loaders = null));
      } catch (e) {
        this.loaders = null;
      } finally {
        this.loaders = null;
      }
    }
    // hace una pausa
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
