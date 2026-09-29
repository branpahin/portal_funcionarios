import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { ModalController } from '@ionic/angular';
import { PortalService } from 'src/services/portal.service';
import { UserInteractionService } from 'src/services/user-interaction-service.service';
import { TypeThemeColor } from 'src/app/enums/TypeThemeColor';
import { ModalVistaPreviaPage } from './modal-vista-previa/modal-vista-previa.page';

interface Empresa {
  id: number;
  nombre: string;
}

interface TipoDato {
  value: string;
  label: string;
}

@Component({
  selector: 'app-modal-crear-solicitud',
  templateUrl: './modal-crear-solicitud.page.html',
  styleUrls: ['./modal-crear-solicitud.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IONIC_COMPONENTS
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalCrearSolicitudPage implements OnInit {

  formSolicitud!: FormGroup;

  empresas: Empresa[] = [];

  guardando = false;
  cargandoEmpresas = false;
  mostrarVistaPrevia = false;
  tiposSolicitud: any[] = [];
  modoEdicion = false;
  mostrarSelectorEdicion = false;
  tipoSolicitudSeleccionado: any = null;

  tiposDato: TipoDato[] = [
    {
      value: 'STRING',
      label: 'Texto'
    },
    {
      value: 'NUMBER',
      label: 'Número'
    },
    {
      value: 'ITEM',
      label: 'Casilla'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private service: PortalService,
    private UserInteractionService: UserInteractionService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerEmpresas();
    this.agregarParrafo();
  }

  inicializarFormulario(): void {
    this.formSolicitud = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      empresas: [[], Validators.required],
      estado: [0],
      html: [''],
      coD_USER: [''],
      tipoSolicitudSeleccionado: [null],
      parrafos: this.fb.array([])
    });
  }

  get parrafos(): FormArray {
    return this.formSolicitud.get('parrafos') as FormArray;
  }

  agregarParrafo(): void {
    const parrafo = this.fb.group({
      contenido: this.fb.array([]),
      saltoDespues: [false]
    });

    this.parrafos.push(parrafo);

    this.agregarTexto(this.parrafos.length - 1);
  }

  getContenidoParrafo(index: number): FormArray {

    return this.parrafos
      .at(index)
      .get('contenido') as FormArray;

  }

  agregarTexto(parrafoIndex: number): void {

    const contenido = this.getContenidoParrafo(parrafoIndex);

    contenido.push(
      this.fb.group({

        tipo: ['texto'],

        texto: [
          '',
          Validators.required
        ]

      })
    );

  }

  agregarNegrita(parrafoIndex: number): void {

    const contenido = this.getContenidoParrafo(parrafoIndex);

    contenido.push(
      this.fb.group({

        tipo: ['negrita'],

        texto: [
          '',
          Validators.required
        ]

      })
    );

  }

  agregarCampo(parrafoIndex: number): void {
    const contenido = this.getContenidoParrafo(parrafoIndex);

    contenido.push(
      this.fb.group({
        tipo: ['campo'],
        id: [0],
        nombre: ['', Validators.required],
        tipO_DATO: ['STRING', Validators.required],
        estado: [1],
        iD_CAMPO_PADRE: [0]
      })
    );
  }

  obtenerNumeroCampo(): number {

    let cantidad = 0;

    this.parrafos.controls.forEach(parrafo => {

      const contenido =
        parrafo.get('contenido') as FormArray;

      contenido.controls.forEach(elemento => {

        if (
          elemento.get('tipo')?.value === 'campo'
        ) {

          cantidad++;

        }

      });

    });

    return cantidad + 1;

  }

  eliminarParrafo(index: number): void {

    this.parrafos.removeAt(index);

  }

  eliminarElemento(
    parrafoIndex: number,
    elementoIndex: number
  ): void {
    const contenido =
      this.getContenidoParrafo(parrafoIndex);

    contenido.removeAt(elementoIndex);
  }

  obtenerTipoElemento(
    parrafoIndex: number,
    elementoIndex: number
  ): string {

    return this
      .getContenidoParrafo(parrafoIndex)
      .at(elementoIndex)
      .get('tipo')
      ?.value;

  }

  agregarSalto(parrafoIndex: number): void {
    const parrafo = this.parrafos.at(parrafoIndex);

    parrafo.get('saltoDespues')?.setValue(true);
  }


  generarHtml(): string {
    let contenidoHtml = '';

    this.parrafos.controls.forEach(parrafo => {
      const contenido = parrafo.get('contenido') as FormArray;

      let parrafoHtml = '';

      contenido.controls.forEach(elemento => {
        const tipo = elemento.get('tipo')?.value;

        if (tipo === 'texto') {
          const texto = elemento.get('texto')?.value || '';

          parrafoHtml += this.escaparHtml(texto)
            .replace(/\r\n/g, '<br>')
            .replace(/\n/g, '<br>')
            .replace(/\r/g, '<br>');
        }

        if (tipo === 'negrita') {
          const texto = elemento.get('texto')?.value || '';

          parrafoHtml += `<strong>${this.escaparHtml(texto)
            .replace(/\r\n/g, '<br>')
            .replace(/\n/g, '<br>')
            .replace(/\r/g, '<br>')}</strong>`;
        }

        if (tipo === 'campo') {
          const nombre = elemento.get('nombre')?.value?.trim();

          if (nombre) {
            parrafoHtml += `<span>{{${this.escaparHtml(nombre)}}}</span>`;
          }
        }
      });

      if (parrafoHtml.trim()) {
        contenidoHtml += `<p>${parrafoHtml}</p>`;
      }

      if (parrafo.get('saltoDespues')?.value) {
        contenidoHtml += '<br>';
      }
    });

    return `<!DOCTYPE html><html lang=\"es\"><body><div style=\"font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.5;\">${contenidoHtml}</div></body></html>`;
  }

  escaparHtml(valor: string): string {

    if (!valor) {
      return '';
    }

    return valor
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  }

  obtenerCamposDelDocumento(): any[] {
    const campos: any[] = [];
    const nombresCampos = new Set<string>();

    this.parrafos.controls.forEach(parrafo => {

      const contenido =
        parrafo.get('contenido') as FormArray;

      contenido.controls.forEach(elemento => {

        if (elemento.get('tipo')?.value !== 'campo') {
          return;
        }

        const nombre =
          elemento.get('nombre')?.value?.trim();

        if (!nombre || nombresCampos.has(nombre)) {
          return;
        }

        nombresCampos.add(nombre);

        campos.push({
          id: elemento.get('id')?.value || 0,
          nombre: nombre,
          tipO_DATO:
            elemento.get('tipO_DATO')?.value || 'texto',
          estado:
            elemento.get('estado')?.value ? 1 : 0,
          nombrE_JSON: nombre,
          iD_CAMPO_PADRE:
            elemento.get('iD_CAMPO_PADRE')?.value || 0
        });

      });

    });

    return campos;
  }

  crearSolicitud(): void {

    if (this.formSolicitud.invalid) {

      this.formSolicitud.markAllAsTouched();

      console.log(
        'FORMULARIO INVALIDO:',
        this.formSolicitud.getRawValue()
      );

      return;
    }


    const valores =
      this.formSolicitud.getRawValue();


    const camposRequest =
      this.obtenerCamposDelDocumento();


    console.log(
      'CAMPOS:',
      camposRequest
    );


    if (camposRequest.length === 0) {

      this.UserInteractionService.presentToast(
        'Debes agregar al menos un campo al documento'
      );

      return;
    }


    const html =
      this.generarHtml();


    const request = {

      id: valores.id,

      nombre: valores.nombre,

      descripcion: valores.descripcion,

      empresas: valores.empresas,

      estado: valores.estado,

      html: html,

      coD_USER: valores.coD_USER,

      campos: camposRequest

    };


    console.log(
      'HTML GENERADO:',
      html
    );


    console.log(
      'REQUEST FINAL:',
      JSON.stringify(
        request,
        null,
        2
      )
    );

    console.log("request: ",request)
    this.guardando = true;
    if(!this.modoEdicion){
      this.service
        .postCrearSolicitud(request)
        .subscribe({

          next: async (resp) => {

            this.guardando = false;

            this.UserInteractionService
              .dismissLoading();


            this.UserInteractionService
              .presentToast(
                'Solicitud creada correctamente',
                TypeThemeColor.SUCCESS
              );


            this.modalController.dismiss({

              creado: true,

              data: resp.data

            });

          },


          error: (err) => {

            console.error(
              'Error al enviar formulario:',
              err
            );


            this.guardando = false;

            this.UserInteractionService
              .dismissLoading();


            this.UserInteractionService
              .presentToast(
                err.error?.data?.error ||
                'Error desconocido, por favor contactese con el area encargada'
              );

          }

        });
    } else {
      this.service
        .postUpdateSolicitud(request)
        .subscribe({

          next: async (resp) => {

            this.guardando = false;

            this.UserInteractionService
              .dismissLoading();


            this.UserInteractionService
              .presentToast(
                'Solicitud creada correctamente',
                TypeThemeColor.SUCCESS
              );


            this.modalController.dismiss({

              creado: true,

              data: resp.data

            });

          },


          error: (err) => {

            console.error(
              'Error al enviar formulario:',
              err
            );


            this.guardando = false;

            this.UserInteractionService
              .dismissLoading();


            this.UserInteractionService
              .presentToast(
                err.error?.data?.error ||
                'Error desconocido, por favor contactese con el area encargada'
              );

          }

        });
    }

  }

  obtenerEmpresas(): void {

    this.UserInteractionService.showLoading(
      'Cargando...'
    );

    this.cargandoEmpresas = true;


    this.service.getEmpresasFuncionario()
      .subscribe({

        next: async (resp) => {

          this.empresas =
            resp?.data?.datos?.listadoEmpresas ?? [];

          this.cargandoEmpresas = false;

          this.UserInteractionService.dismissLoading();

        },

        error: (err) => {

          console.error(
            'Error al obtener empresas:',
            err
          );

          this.empresas = [];

          this.cargandoEmpresas = false;

          this.UserInteractionService.dismissLoading();

          this.UserInteractionService.presentToast(
            err.error?.data?.error ||
            'Error desconocido, por favor contactese con el area encargada'
          );

        }

      });

  }

  async abrirVistaPrevia(): Promise<void> {

  const html = this.generarHtml();

    const modal = await this.modalController.create({
      component: ModalVistaPreviaPage,
      componentProps: {
        html
      },
      cssClass: 'modal-vista-previa'
    });

    await modal.present();
  }

  cargarTipoSolicitud(tipo: any): void {

     if (!tipo) {
      return;
    }

    this.formSolicitud.patchValue({
      id: tipo.id,
      nombre: tipo.nombre,
      descripcion: tipo.descripcion,
      empresas: tipo.empresas ?? [],
      estado: tipo.estado ?? 0,
      html: tipo.html ?? '',
      coD_USER: tipo.coD_USER ?? ''
    });

    this.cargarHtmlEnEditor(
      tipo.html,
      tipo.campos ?? []
    );
  }

  cargarHtmlEnEditor(
    html: string,
    camposBackend: any[]
  ): void {

    this.parrafos.clear();

    if (!html) {
      this.agregarParrafo();
      return;
    }

    const parser = new DOMParser();
    const documento = parser.parseFromString(
      html,
      'text/html'
    );

    const elementos = documento.body.querySelectorAll(
      'p, br'
    );

    elementos.forEach(elemento => {

      if (elemento.tagName.toLowerCase() === 'br') {

        if (this.parrafos.length > 0) {
          const ultimoParrafo =
            this.parrafos.at(
              this.parrafos.length - 1
            );

          ultimoParrafo
            .get('saltoDespues')
            ?.setValue(true);
        }

        return;
      }

      const parrafo = this.fb.group({
        contenido: this.fb.array([]),
        saltoDespues: [false]
      });

      this.parrafos.push(parrafo);

      const contenido =
        parrafo.get('contenido') as FormArray;

      this.procesarContenidoHtml(
        elemento,
        contenido,
        camposBackend
      );

      if (contenido.length === 0) {
        contenido.push(
          this.fb.group({
            tipo: ['texto'],
            texto: ['']
          })
        );
      }
    });

    if (this.parrafos.length === 0) {
      this.agregarParrafo();
    }
  }

  procesarContenidoHtml(
    nodo: Node,
    contenido: FormArray,
    camposBackend: any[]
  ): void {

    nodo.childNodes.forEach((child: Node) => {

      if (child.nodeType === Node.TEXT_NODE) {

        const texto = child.textContent ?? '';

        if (!texto) {
          return;
        }

        const regex = /\{\{([^{}]+)\}\}/g;

        let ultimoIndice = 0;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(texto)) !== null) {

          const textoAntes = texto.substring(
            ultimoIndice,
            match.index
          );

          if (textoAntes) {
            contenido.push(
              this.fb.group({
                tipo: ['texto'],
                texto: [textoAntes]
              })
            );
          }

          const nombreCampo = match[1].trim();

          const campoBackend = camposBackend.find(
            campo =>
              campo.nombre?.replace(/^\{\{|\}\}$/g, '').trim() ===
              nombreCampo
          );

          contenido.push(
            this.fb.group({
              tipo: ['campo'],
              id: [campoBackend?.id ?? 0],
              nombre: [nombreCampo, Validators.required],
              tipO_DATO: [
                this.convertirTipoDato(campoBackend?.tipO_DATO),
                Validators.required
              ],
              estado: [campoBackend?.estado ?? 1],
              iD_CAMPO_PADRE: [campoBackend?.iD_CAMPO_PADRE ?? 0],
              nombrE_JSON: [campoBackend?.nombrE_JSON ?? nombreCampo.toUpperCase()]
            })
          );

          ultimoIndice = regex.lastIndex;
        }

        const textoDespues = texto.substring(ultimoIndice);

        if (textoDespues) {
          contenido.push(
            this.fb.group({
              tipo: ['texto'],
              texto: [textoDespues]
            })
          );
        }

        return;
      }

      if (child.nodeType === Node.ELEMENT_NODE) {

        const elemento = child as HTMLElement;

        const tag = elemento.tagName.toLowerCase();

        if (tag === 'strong' || tag === 'b') {

          const texto = elemento.textContent ?? '';

          if (texto) {
            contenido.push(
              this.fb.group({
                tipo: ['negrita'],
                texto: [texto]
              })
            );
          }

          return;
        }

        if (tag === 'span') {

          const texto = elemento.textContent?.trim() ?? '';

          const match = texto.match(/^\{\{(.+?)\}\}$/);

          if (match) {

            const nombreCampo = match[1].trim();

            const campoBackend = camposBackend.find(
              campo =>
                campo.nombre?.replace(/^\{\{|\}\}$/g, '').trim() ===
                nombreCampo
            );

            contenido.push(
              this.fb.group({
                tipo: ['campo'],
                id: [campoBackend?.id ?? 0],
                nombre: [nombreCampo, Validators.required],
                tipO_DATO: [
                  this.convertirTipoDato(campoBackend?.tipO_DATO),
                  Validators.required
                ],
                estado: [campoBackend?.estado ?? 1],
                iD_CAMPO_PADRE: [campoBackend?.iD_CAMPO_PADRE ?? 0],
                nombrE_JSON: [
                  campoBackend?.nombrE_JSON ??
                  nombreCampo.toUpperCase()
                ]
              })
            );

            return;
          }
        }

        this.procesarContenidoHtml(
          elemento,
          contenido,
          camposBackend
        );
      }
    });
  }

  convertirTipoDato(tipo: string): string {

    switch ((tipo || '').toUpperCase()) {

      case 'NUMBER':
        return 'NUMVER';

      case 'BOOLEAN':
        return 'ITEM';

      case 'ITEM':
        return 'ITEM';

      case 'STRING':
      default:
        return 'STRING';
    }
  }

  editar(){
    this.obtenerTiposSolicitud();
    this.mostrarSelectorEdicion = true;
    this.modoEdicion = true;
  }

  obtenerTiposSolicitud(): void {
    this.service.getTipoSolicitudesFuncionario().subscribe({
      next: (resp: any) => {
        this.tiposSolicitud =
          resp?.data?.datos?.listadoTiposSolicitud ?? [];
      },
      error: () => {
        this.tiposSolicitud = [];
      }
    });

  }

  cerrarModal(): void {

    this.modalController.dismiss();

  }

}