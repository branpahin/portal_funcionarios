import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInteractionService } from 'src/services/user-interaction-service.service';
import { IONIC_COMPONENTS } from '../../../imports/ionic-imports';
import { PortalService } from 'src/services/portal.service';

interface CampoSolicitud {
  id: number;
  nombre: string;
  tipO_DATO: string;
  estado: number;
  nombrE_JSON: string;
  iD_CAMPO_PADRE: number;
}

interface TipoSolicitud {
  id: number;
  nombre: string;
  descripcion: string;
  empresas: number[];
  estado: number;
  html: string;
  coD_USER: string | null;
  campos: CampoSolicitud[];
}

interface ElementoTexto {
  tipo: 'texto';
  contenido: string;
}

interface ElementoCampo {
  tipo: 'campo';
  campo: CampoSolicitud;
}

interface ElementoElemento {
  tipo: 'elemento';
  tag: string;
  atributos: Record<string, string>;
  hijos: ElementoHtml[];
}

type ElementoHtml =
  | ElementoTexto
  | ElementoCampo
  | ElementoElemento;

interface OpcionCampo {
  valor: string;
  nombre: string;
}


@Component({
  selector: 'app-diligenciar-solicitud',
  templateUrl: './diligenciar-solicitud.page.html',
  styleUrls: ['./diligenciar-solicitud.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DiligenciarSolicitudPage implements OnInit, AfterViewInit  {
  @ViewChildren('canvasFirma')
  canvasesFirma!: QueryList<ElementRef<HTMLCanvasElement>>;

  @ViewChild('inputImagenFirma')
  inputImagenFirma!: ElementRef<HTMLInputElement>;

  private firmas = new Map<string, HTMLCanvasElement>();

  private campoFirmaSeleccionado: CampoSolicitud | null = null;

  tiposSolicitud: TipoSolicitud[] = [];
  private contextoFirma = new Map<
    string,
    CanvasRenderingContext2D
  >();
  tipoSolicitudSeleccionado: TipoSolicitud | null = null;

  formSolicitud: FormGroup = this.fb.group({});

  elementosHtml: ElementoHtml[] = [];

  cargando = false;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service:PortalService,
    private UserInteractionService: UserInteractionService,
  ) {}

  ngAfterViewInit(): void {
    this.canvasesFirma.changes.subscribe(() => {
      setTimeout(() => {
        this.inicializarCanvasesFirma();
      });
    });

    setTimeout(() => {
      this.inicializarCanvasesFirma();
    });
  }

  ngOnInit(): void {
    this.obtenerTiposSolicitud();
  }

  obtenerTiposSolicitud(): void {

    this.cargando = true;

  
    this.service.getTipoSolicitudesFuncionario().subscribe({
      next: (resp: any) => {

        this.tiposSolicitud =
          resp?.data?.datos?.listadoTiposSolicitud ?? [];

        this.cargando = false;
      },

      error: () => {
        this.tiposSolicitud = [];
        this.cargando = false;
      }
    });

    this.cargando = false;
  }

  seleccionarTipoPorId(id: number): void {

    const tipo = this.tiposSolicitud.find(
      x => x.id === id
    );

    if (!tipo) {
      this.limpiarSolicitud();
      return;
    }

    this.seleccionarTipoSolicitud(tipo);
  }

  seleccionarTipoSolicitud(tipo: TipoSolicitud): void {

    this.tipoSolicitudSeleccionado = tipo;

    this.crearFormulario(tipo.campos);

    this.procesarHtml(
      tipo.html,
      tipo.campos
    );
  }

  crearFormulario(campos: CampoSolicitud[]): void {

    const controles: {
      [key: string]: FormControl
    } = {};

    campos
      .filter(campo => campo.estado === 1)
      .forEach(campo => {

        controles[campo.nombrE_JSON] =
          new FormControl(
            this.obtenerValorInicial(campo),
            this.esObligatorio(campo)
              ? Validators.required
              : []
          );
      });

    this.formSolicitud = this.fb.group(
      controles
    );
  }

  obtenerValorInicial(
    campo: CampoSolicitud
  ): any {

    switch (
      campo.tipO_DATO?.toUpperCase()
    ) {

      case 'BOOLEAN':
        return false;

      case 'NUMBER':
        return null;

      case 'ITEM':
        return false;

      default:
        return '';
    }
  }

  esCampoFirma(campo: CampoSolicitud): boolean {
    const nombre = campo.nombrE_JSON?.toLowerCase() ?? '';
    return nombre.includes('firma') && !nombre.includes('cedula');
  }
 
  esObligatorio(
    campo: CampoSolicitud
  ): boolean {

    return campo.estado === 1;
  }

  procesarHtml(
    html: string,
    campos: CampoSolicitud[]
  ): void {

    if (!html) {
      this.elementosHtml = [];
      return;
    }

    const parser = new DOMParser();

    const documento = parser.parseFromString(
      html,
      'text/html'
    );

    const camposActivos = campos.filter(
      campo => campo.estado === 1
    );

    this.elementosHtml = this.procesarNodo(
      documento.body,
      camposActivos
    );
  }

  procesarNodo(
    nodo: Node,
    campos: CampoSolicitud[]
  ): ElementoHtml[] {

    const elementos: ElementoHtml[] = [];

    nodo.childNodes.forEach(child => {

      if (child.nodeType === Node.TEXT_NODE) {

        const texto = child.textContent || '';

        const regex = /{{\s*[\w.-]+\s*}}/g;

        let ultimaPosicion = 0;

        let coincidencia: RegExpExecArray | null;

        while (
          (coincidencia = regex.exec(texto)) !== null
        ) {

          if (coincidencia.index > ultimaPosicion) {

            elementos.push({
              tipo: 'texto',
              contenido: texto.substring(
                ultimaPosicion,
                coincidencia.index
              )
            });
          }

          const identificador =
            coincidencia[0].trim();

          const campo =
            campos.find(
              x => x.nombre.trim() === identificador
            );

          if (campo) {

            elementos.push({
              tipo: 'campo',
              campo
            });

          } else {

            elementos.push({
              tipo: 'texto',
              contenido: coincidencia[0]
            });
          }

          ultimaPosicion =
            coincidencia.index +
            coincidencia[0].length;
        }

        if (ultimaPosicion < texto.length) {

          elementos.push({
            tipo: 'texto',
            contenido: texto.substring(
              ultimaPosicion
            )
          });
        }

        return;
      }

      if (child.nodeType === Node.ELEMENT_NODE) {

        const elemento =
          child as HTMLElement;

        elementos.push({
          tipo: 'elemento',
          tag: elemento.tagName.toLowerCase(),
          atributos: this.obtenerAtributos(elemento),
          hijos: this.procesarNodo(
            elemento,
            campos
          )
        });
      }

    });

    return elementos;
  }

  obtenerAtributos(
    elemento: HTMLElement
  ): Record<string, string> {

    const atributos: Record<string, string> = {};

    Array.from(elemento.attributes).forEach(
      atributo => {

        atributos[atributo.name] =
          atributo.value;

      }
    );

    return atributos;
  }

  esTipoCampo(
    elemento: ElementoHtml
  ): elemento is ElementoCampo {

    return elemento.tipo === 'campo';
  }

  obtenerPlaceholder(
    campo: CampoSolicitud
  ): string {

    return campo.nombrE_JSON
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, letra =>
        letra.toUpperCase()
      );
  }

  obtenerOpciones(
    campo: CampoSolicitud
  ): OpcionCampo[] {

    if (
      campo.tipO_DATO?.toUpperCase() !==
      'SELECT'
    ) {
      return [];
    }

    if (!this.tipoSolicitudSeleccionado) {
      return [];
    }

    const items =
      this.tipoSolicitudSeleccionado.campos
        .filter(
          x =>
            x.iD_CAMPO_PADRE === campo.id &&
            x.tipO_DATO?.toUpperCase() ===
              'ITEM' &&
            x.estado === 1
        );

    return items.map(item => ({
      valor: item.nombrE_JSON,
      nombre: this.obtenerNombreItem(item)
    }));
  }

  obtenerNombreItem(
    campo: CampoSolicitud
  ): string {

    const nombre =
      campo.nombre
        .replace(/{{/g, '')
        .replace(/}}/g, '');

    return nombre
      .replace(
        /([A-Z])/g,
        ' $1'
      )
      .replace(
        /^./,
        letra => letra.toUpperCase()
      );
  }

  cambioSelect(
    campo: CampoSolicitud
  ): void {

    const valor =
      this.formSolicitud.get(
        campo.nombrE_JSON
      )?.value;

    if (!this.tipoSolicitudSeleccionado) {
      return;
    }

    const items =
      this.tipoSolicitudSeleccionado.campos
        .filter(
          x =>
            x.iD_CAMPO_PADRE === campo.id &&
            x.tipO_DATO?.toUpperCase() ===
              'ITEM'
        );

    items.forEach(item => {

      const control =
        this.formSolicitud.get(
          item.nombrE_JSON
        );

      if (!control) {
        return;
      }

      control.setValue(
        valor === item.nombrE_JSON
      );

    });
  }

  inicializarCanvasesFirma(): void {

    this.canvasesFirma.forEach(canvasRef => {

      const canvas = canvasRef.nativeElement;

      const nombreCampo =
        canvas.getAttribute('data-campo');

      if (!nombreCampo) return;

      if (this.firmas.has(nombreCampo)) return;

      this.configurarCanvas(
        canvas,
        nombreCampo
      );

    });

  }

  configurarCanvas(
    canvas: HTMLCanvasElement,
    nombreCampo: string
  ): void {

    const rect = canvas.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const contexto = canvas.getContext('2d');

    if (!contexto) return;

    contexto.scale(dpr, dpr);

    contexto.lineWidth = 2;
    contexto.lineCap = 'round';
    contexto.lineJoin = 'round';
    contexto.strokeStyle = '#000000';

    let dibujando = false;

    canvas.addEventListener('pointerdown', (event: PointerEvent) => {

      event.preventDefault();

      dibujando = true;

      canvas.setPointerCapture(event.pointerId);

      const posicion =
        this.obtenerPosicionCanvas(
          canvas,
          event
        );

      contexto.beginPath();

      contexto.moveTo(
        posicion.x,
        posicion.y
      );

    });

    canvas.addEventListener('pointermove', (event: PointerEvent) => {

      event.preventDefault();

      if (!dibujando) return;

      const posicion =
        this.obtenerPosicionCanvas(
          canvas,
          event
        );

      contexto.lineTo(
        posicion.x,
        posicion.y
      );

      contexto.stroke();

    });

    canvas.addEventListener('pointerup', (event: PointerEvent) => {

      event.preventDefault();

      dibujando = false;

      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }

    });

    canvas.addEventListener('pointercancel', () => {
      dibujando = false;
    });

    this.firmas.set(
      nombreCampo,
      canvas
    );

  }

  obtenerPosicionCanvas(
    canvas: HTMLCanvasElement,
    event: PointerEvent
  ): { x: number; y: number } {

    const rect =
      canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

  }

  guardarFirma(campo: CampoSolicitud): void {

    const canvas = this.firmas.get(
      campo.nombrE_JSON
    );

    if (!canvas) return;

    const imagen =
      canvas.toDataURL('image/png');

    this.obtenerControl(campo)
      .setValue(imagen);

    console.log(
      'Firma guardada:',
      campo.nombrE_JSON
    );

  }

  limpiarFirma(campo: CampoSolicitud): void {

    const canvas = this.firmas.get(
      campo.nombrE_JSON
    );

    if (!canvas) return;

    const contexto = canvas.getContext('2d');

    if (!contexto) return;

    contexto.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    this.obtenerControl(campo)
      .setValue(null);

  }

  seleccionarImagenFirma(
    campo: CampoSolicitud
  ): void {

    this.campoFirmaSeleccionado = campo;

    this.inputImagenFirma.nativeElement.value = '';

    this.inputImagenFirma.nativeElement.click();

  }

  imagenFirmaSeleccionada(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const archivo = input.files?.[0];

    if (!archivo || !this.campoFirmaSeleccionado) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      const imagen =
        new Image();

      imagen.onload = () => {

        const canvas =
          this.firmas.get(
            this.campoFirmaSeleccionado!.nombrE_JSON
          );

        if (!canvas) return;

        const contexto =
          canvas.getContext('2d');

        if (!contexto) return;

        contexto.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        contexto.drawImage(
          imagen,
          0,
          0,
          canvas.width,
          canvas.height
        );

        this.obtenerControl(
          this.campoFirmaSeleccionado!
        ).setValue(
          canvas.toDataURL('image/png')
        );

      };

      imagen.src = reader.result as string;

    };

    reader.readAsDataURL(archivo);

  }

  obtenerControl(
    campo: CampoSolicitud
  ): FormControl {

    return this.formSolicitud.get(
      campo.nombrE_JSON
    ) as FormControl;
  }

  obtenerValores(): any {

    return this.formSolicitud.getRawValue();
  }

  realizarSolicitud(): void {

    if (!this.tipoSolicitudSeleccionado) {
      return;
    }

    if (this.formSolicitud.invalid) {

      this.formSolicitud.markAllAsTouched();

      return;
    }

    this.guardando = true;

    const valores =
      this.formSolicitud.getRawValue();

    const request = {

      idTipoSolicitud:
        this.tipoSolicitudSeleccionado.id,

      valores
    };

    console.log(
      'Solicitud a enviar:',
      request
    );

    

    this.guardando = false;
  }

 
  limpiarSolicitud(): void {

    this.tipoSolicitudSeleccionado = null;

    this.elementosHtml = [];

    this.formSolicitud =
      this.fb.group({});
  }

  volver(): void {

    this.router.navigate([
      '/panel-solicitudes'
    ]);
  }
}
