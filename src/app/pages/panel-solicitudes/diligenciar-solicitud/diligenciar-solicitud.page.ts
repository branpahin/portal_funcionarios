import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInteractionService } from 'src/services/user-interaction-service.service';
import { IONIC_COMPONENTS } from '../../../imports/ionic-imports';
import { PortalService } from 'src/services/portal.service';
import { TypeThemeColor } from 'src/app/enums/TypeThemeColor';
import { ModuleService } from 'src/services/modulos/module.service';
import { IAlertAction } from 'src/interfaces/IAlertOptions';

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
  documentos?: DocumentoSolicitud[];
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
  campo?: CampoSolicitud;
}

interface DocumentoSolicitud {
  id: string;
  nombre: string;
  descripcion: string;
  obligatorio: string;
  extensioneS_PERMITIDAS: string;
  tipoS_MIME_PERMITIDOS: string;
  pesO_MAX_MB: string;
  cantidaD_MIN: string;
  cantidaD_MAX: string;
  orden: string;
}

interface AnexoGuardado {
  id: number;
  iD_DOCUMENTO_REQ: number;
  nombrE_ORIGINAL: string;
  extension: string;
  tipO_MIME: string;
  pesO_BYTES: number;
  fechA_REGISTRO: string;
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

  @ViewChild('inputArchivoDocumento')
  inputArchivoDocumento!: ElementRef<HTMLInputElement>;

  documentosRequeridos: DocumentoSolicitud[] = [];
  archivosDocumento: Record<string, File[]> = {};
  erroresDocumento: Record<string, string> = {};
  private documentoActivo: DocumentoSolicitud | null = null;
  anexosGuardados: Record<string, AnexoGuardado[]> = {};
  anexosAEliminar = new Set<number>(); 

  private firmas = new Map<string, HTMLCanvasElement>();

  private campoFirmaSeleccionado: CampoSolicitud | null = null;
  private readonly ALIAS_RADIO: Record<string, string> = {
    DEFUNCION_COMPANERO_HIJOS: 'DEFUNCION_COMPANEROS_HIJOS',
    DEFUNCION_HIJO_30DIAS: 'DEFUNCION_HIJO_RECIEN_NACIDO',
    DEFUNCION_CONYUGUE_PADRES_HIJOS: 'DEFUNCION_CONYUGE',
  };

  tiposSolicitud: TipoSolicitud[] = [];
  private contextoFirma = new Map<
    string,
    CanvasRenderingContext2D
  >();
  tipoSolicitudSeleccionado: TipoSolicitud | null = null;

  formSolicitud: FormGroup = this.fb.group({});
  solicitud:any
  esAdministrador = true
  elementosHtml: ElementoHtml[] = [];

  cargando = false;
  guardando = false;

  terminoBusqueda = '';
  resultadosColaboradores: any[] = [];
  buscandoColaboradores = false;
  mostrarResultados = false;
  colaboradorSeleccionado: any = null;
  private busquedaSeq = 0; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service:PortalService,
    private UserInteractionService: UserInteractionService,
    private moduleService:ModuleService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef 
  ) {
    const navigation = this.router.getCurrentNavigation();
    let state: any = navigation?.extras?.state;
    if (state) {
      this.solicitud = state['solicitud'] || [];
    }
  }

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

    this.UserInteractionService.showLoading('Guardando...');
    this.service.getTipoSolicitudesFuncionario().subscribe({
      next: (resp: any) => {

        this.tiposSolicitud =
          resp?.data?.datos?.listadoTiposSolicitud ?? [];
        this.UserInteractionService.dismissLoading();
        this.cargando = false;
        if(this.solicitud){
          this.obtenerSolicitudPorId(this.solicitud.id)
        }
      },

      error: () => {
        this.tiposSolicitud = [];
        this.cargando = false;
        this.UserInteractionService.dismissLoading();
      }
    });

    this.cargando = false;
    this.UserInteractionService.dismissLoading();
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

  seleccionarTipoSolicitud(tipo: TipoSolicitud, valores?: any): void {

    this.tipoSolicitudSeleccionado = tipo;

    this.firmas.clear();
    this.contextoFirma.clear();

    this.documentosRequeridos = [...(tipo.documentos ?? [])]
      .sort((a, b) => Number(a.orden) - Number(b.orden));
    this.archivosDocumento = {};
    this.erroresDocumento = {};
    this.anexosGuardados = {};
      (valores?.anexos ?? [])
        .filter((a: any) => a.estado === 1)
        .forEach((a: AnexoGuardado) => {
          const clave = String(a.iD_DOCUMENTO_REQ);
          (this.anexosGuardados[clave] ??= []).push(a);
        });

    this.anexosAEliminar.clear();

    this.crearFormulario(tipo.campos);

    if (valores) {
      const valoresFormulario = this.mapearValoresFormulario(
        valores,
        tipo.campos
      );

      this.formSolicitud.patchValue(valoresFormulario);
    }


    this.procesarHtml(
      tipo.html,
      tipo.campos
    );

    setTimeout(() => {
      this.inicializarCanvasesFirma();
      if (valores) {
        this.cargarFirmasDesdeFormulario();
      }
    }, 100);
  }

  mapearValoresFormulario(
    valores: any,
    campos: CampoSolicitud[]
  ): any {

    const resultado: any = {};

    // Los campos ahora vienen dentro de campoS_SOLICITUD
    const camposSolicitud = valores.campoS_SOLICITUD ?? [];

    campos
      .filter(campo => campo.estado === 1)
      .forEach(campo => {

        const nombreCampo = campo.nombrE_JSON;

        // Buscar el campo correspondiente por identificador
        const campoEncontrado = camposSolicitud.find(
          (item: any) =>
            item.identificador?.toLowerCase() === nombreCampo.toLowerCase()
        );

        if (!campoEncontrado) {
          return;
        }

        let valor = campoEncontrado.valor;

        const tipo = campo.tipO_DATO
          ?.trim()
          .toUpperCase();

        // Convertir los valores BOOLEAN e ITEM
        if (tipo === 'BOOLEAN' || tipo === 'ITEM') {
          valor =
            valor === true ||
            valor === 1 ||
            valor === '1' ||
            valor === 'true';
        }

        resultado[nombreCampo] = valor;
      });

    if (this.solicitud) {
      resultado['observaciones'] = Array.isArray(valores.observaciones)
        ? valores.observaciones
        : [];

      resultado['id'] = valores.id;
    }

    return resultado;
  }

  get observacionesSolicitud(): any[] {
    const observaciones = this.formSolicitud
      ?.get('observaciones')
      ?.value;

    return Array.isArray(observaciones)
      ? observaciones
      : [];
  }

  obtenerNombreEstadoObservacion(estado: number): string {
    switch (estado) {
      case 2:
        return 'Aprobación';

      case 3:
        return 'Cancelación';

      default:
        return `Estado ${estado}`;
    }
  }

  obtenerColorEstadoObservacion(estado: number): string {
    switch (estado) {
      case 2:
        return 'success';

      case 3:
        return 'danger';

      default:
        return 'medium';
    }
  }

  cargarFirmasDesdeFormulario(): void {

    this.canvasesFirma.forEach(canvasRef => {

      const canvas = canvasRef.nativeElement;

      const nombreCampo =
        canvas.getAttribute('data-campo');

      if (!nombreCampo) {
        return;
      }

      const valor =
        this.formSolicitud.get(nombreCampo)?.value;

      if (!valor || typeof valor !== 'string') {
        return;
      }

      if (!valor.startsWith('data:image')) {
        return;
      }

      const imagen = new Image();

      imagen.onload = () => {

        const contexto = canvas.getContext('2d');

        if (!contexto) {
          return;
        }

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
      };

      imagen.src = valor;
    });
  }

  obtenerSolicitudPorId(id: number): void {

    this.cargando = true;

    this.service.obtenerSolicitudPorId(id).subscribe({
      next: (resp: any) => {

        const solicitud = resp?.data?.datos;

        if (!solicitud) {
          this.cargando = false;
          return;
        }

        const idTipoSolicitud = Number(
          solicitud.iD_TIPO_SOLICITUD
        );

        const tipo = this.tiposSolicitud.find(
          x => x.id === idTipoSolicitud
        );

        if (!tipo) {
          console.error(
            'No se encontró el tipo de solicitud:',
            idTipoSolicitud
          );

          this.cargando = false;
          return;
        }

        this.seleccionarTipoSolicitud(tipo, solicitud);

        this.cargando = false;
      },

      error: () => {
        this.cargando = false;
      }
    });
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
    if(this.solicitud){
      controles['observaciones'] = new FormControl([]);
      controles['id'] = new FormControl([]);
    }
   
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

      // ==========================================
      // TEXTO
      // ==========================================
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

      // ==========================================
      // ELEMENTOS HTML
      // ==========================================
      if (child.nodeType === Node.ELEMENT_NODE) {

        const elemento =
          child as HTMLElement;

        const tag =
          elemento.tagName.toLowerCase();

        const atributos =
          this.obtenerAtributos(elemento);

        // Detectar inputs que vienen dentro del HTML
        if (tag === 'input') {

          let campo: CampoSolicitud | undefined;

          // Primero intenta identificarlo por {{campo}}
          const textoAtributos =
            Object.values(atributos).join(' ');

          const coincidencia =
            textoAtributos.match(/{{\s*[\w.-]+\s*}}/);

          if (coincidencia) {

            const identificador =
              coincidencia[0].trim();

            campo =
              campos.find(
                x =>
                  x.nombre.trim() === identificador
              );
          }

          // Si no lo encontró, para radio intenta
          // identificarlo por value = nombrE_JSON
          if (!campo && atributos['type']?.toLowerCase() === 'radio') {

            const valorOriginal = atributos['value']?.trim().toUpperCase();
            const valor = ( valorOriginal)?.toLowerCase();

            campo = campos.find(
              x => x.nombrE_JSON?.trim().toLowerCase() === valor
            );
          }

          elementos.push({
            tipo: 'elemento',
            tag,
            atributos,
            hijos: [],
            campo
          });

          return;
        }

        elementos.push({
          tipo: 'elemento',
          tag,
          atributos,
          hijos: this.procesarNodo(
            elemento,
            campos
          )
        });
      }

    });

    return elementos;
  }

  obtenerValorRadio(
    elemento: ElementoElemento
  ): boolean {

    if (!elemento.campo) {
      return false;
    }

    return this.obtenerControl(
      elemento.campo
    )?.value === true;
  }

  seleccionarRadio(
    elemento: ElementoElemento
  ): void {

    if (!elemento.campo) {
      return;
    }

    const nombreGrupo =
      elemento.atributos['name'];

    const valorSeleccionado =
      elemento.atributos['value'];

    if (!nombreGrupo || !valorSeleccionado) {
      return;
    }

    // Buscar todos los inputs de ese mismo grupo
    const radios =
      document.querySelectorAll(
        `input[data-radio-group="${nombreGrupo}"]`
      );

    radios.forEach((radio: Element) => {

      const campoNombre =
        radio.getAttribute('data-campo');

      if (!campoNombre) {
        return;
      }

      const control =
        this.formSolicitud.get(campoNombre);

      if (!control) {
        return;
      }

      const valor =
        radio.getAttribute('data-radio-value');

      control.setValue(
        valor === valorSeleccionado
      );

    });
  }

  private convertirCamposSolicitudALista(valores: any): any[] {
    return this.tipoSolicitudSeleccionado!.campos
      .filter(campo => campo.estado === 1)
      .map(campo => {

        const identificador = campo.nombrE_JSON;

        const valor = valores[identificador];

        return {
          ID: 0,
          ID_CAMPO_SOLICITUD: campo.id,
          IDENTIFICADOR: identificador,
          VALOR: valor !== null && valor !== undefined
            ? String(valor)
            : ''
        };
      });
  }

  convertirBooleanosAEnteros(valores: any): any {

    const resultado = { ...valores };

    if (!this.tipoSolicitudSeleccionado) {
      return resultado;
    }

    this.tipoSolicitudSeleccionado.campos.forEach(campo => {

      const tipo = campo.tipO_DATO
        ?.trim()
        .toUpperCase();

      if (
        tipo !== 'BOOLEAN' &&
        tipo !== 'ITEM'
      ) {
        return;
      }

      const nombreCampo = campo.nombrE_JSON;

      if (!(nombreCampo in resultado)) {
        return;
      }

      resultado[nombreCampo] =
        resultado[nombreCampo] === true ? 1 : 0;

    });

    return resultado;
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
    if (!this.canvasesFirma || this.canvasesFirma.length === 0) {
      return;
    }
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

  onBuscarColaborador(event: any) {
    const termino = (event.detail.value || '').trim();
    this.terminoBusqueda = termino;

    if (termino.length < 2) {
      this.resultadosColaboradores = [];
      this.mostrarResultados = false;
      return;
    }

    this.buscarColaboradores(termino);
  }

  async buscarColaboradores(termino: string) {
    const seq = ++this.busquedaSeq;
    this.buscandoColaboradores = true;
    this.mostrarResultados = true;

    const esNumero = /^\d+$/.test(termino);
    const campos = esNumero ? ['identificacion'] : ['nombres', 'apellidos'];
    let pendientes = campos.length;
    const unicos = new Map<any, any>();

    const terminar = () => {
      pendientes--;
      if (pendientes === 0 && seq === this.busquedaSeq) {
        this.resultadosColaboradores = Array.from(unicos.values()).slice(0, 10);
        this.buscandoColaboradores = false;
      }
    };

    if (this.esAdministrador) {
      campos.forEach(campo => {
        const payload = {
          first: 0,
          rows: 10,
          sortField: 'nombres',
          sortOrder: 1,
          filters: {
            [campo]: [{ value: termino, matchMode: 'contains', operator: 'and' }]
          }
        };

        this.service.getIDColaboradoresPag(JSON.stringify(payload)).subscribe({
          next: (resp) => {
            if (seq !== this.busquedaSeq) return;
            (resp.data.datos.listadoColaboradores || []).forEach((c: any) =>
              unicos.set(c.identificacion, c)
            );
            terminar();
          },
          error: () => {
            if (seq !== this.busquedaSeq) return;
            terminar();
          }
        });
      });
    }
  }

  // ---------- Documentos anexos ----------

  extensionesDoc(doc: DocumentoSolicitud): string[] {
    return (doc.extensioneS_PERMITIDAS ?? '')
      .split(',')
      .map(e => e.trim().replace('.', '').toLowerCase())
      .filter(Boolean);
  }

  mimesDoc(doc: DocumentoSolicitud): string[] {
    return (doc.tipoS_MIME_PERMITIDOS ?? '')
      .split(',')
      .map(m => m.trim().toLowerCase())
      .filter(Boolean);
  }

  aceptarDoc(doc: DocumentoSolicitud): string {
    return this.extensionesDoc(doc).map(e => '.' + e).join(',');
  }

  esDocObligatorio(doc: DocumentoSolicitud): boolean {
    return doc.obligatorio === '1' || doc.obligatorio?.toLowerCase() === 'true';
  }

  maxDoc(doc: DocumentoSolicitud): number {
    return Math.max(Number(doc.cantidaD_MAX) || 1, 1);
  }

  minRequeridoDoc(doc: DocumentoSolicitud): number {
    const min = Number(doc.cantidaD_MIN) || 0;
    return this.esDocObligatorio(doc) ? Math.max(min, 1) : 0;
  }

  archivosDe(doc: DocumentoSolicitud): File[] {
    return this.archivosDocumento[doc.id] ?? [];
  }

  anexosGuardadosDe(doc: DocumentoSolicitud): AnexoGuardado[] {
    return (this.anexosGuardados[doc.id] ?? [])
      .filter(a => !this.anexosAEliminar.has(a.id));
  }

  quitarAnexoGuardado(anexo: AnexoGuardado): void {
    this.anexosAEliminar.add(anexo.id);
    this.erroresDocumento[String(anexo.iD_DOCUMENTO_REQ)] = '';
  }

  totalArchivos(doc: DocumentoSolicitud): number {
    return this.anexosGuardadosDe(doc).length + this.archivosDe(doc).length;
  }

  documentoCompleto(doc: DocumentoSolicitud): boolean {
    return this.totalArchivos(doc) >= this.minRequeridoDoc(doc);
  }

  get documentosValidos(): boolean {
    return this.documentosRequeridos.every(d => this.documentoCompleto(d));
  }

  formatearTamano(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  abrirSelectorDocumento(doc: DocumentoSolicitud): void {
    this.documentoActivo = doc;
    this.inputArchivoDocumento.nativeElement.value = '';
    this.inputArchivoDocumento.nativeElement.accept = this.aceptarDoc(doc);
    this.inputArchivoDocumento.nativeElement.multiple = this.maxDoc(doc) > 1;
    this.inputArchivoDocumento.nativeElement.click();
  }

  archivosSeleccionados(event: Event): void {
    const doc = this.documentoActivo;
    const input = event.target as HTMLInputElement;
    if (!doc || !input.files?.length) return;

    const extensiones = this.extensionesDoc(doc);
    const mimes = this.mimesDoc(doc);
    const maxBytes = (Number(doc.pesO_MAX_MB) || 5) * 1024 * 1024;
    const max = this.maxDoc(doc);

    const validos: File[] = [];
    let error = '';

    Array.from(input.files).forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

      if (!extensiones.includes(ext)) {
        error = `"${file.name}": formato no permitido (${extensiones.join(', ')}).`;
        return;
      }
      if (file.type && mimes.length && !mimes.includes(file.type.toLowerCase())) {
        error = `"${file.name}": tipo de archivo no permitido.`;
        return;
      }
      if (file.size > maxBytes) {
        error = `"${file.name}": supera el máximo de ${doc.pesO_MAX_MB} MB.`;
        return;
      }
      validos.push(file);
    });

    let actuales = this.archivosDe(doc);

    if (max === 1) {
      if (validos.length) {
        actuales = [validos[0]];
        // el nuevo reemplaza al guardado: se pide su eliminación al back
        (this.anexosGuardados[doc.id] ?? []).forEach(a => this.anexosAEliminar.add(a.id));
      }
    } else {
      const disponibles = max - this.totalArchivos(doc);
      if (validos.length > disponibles) {
        error = `Solo puedes adjuntar ${max} archivo(s) en este documento.`;
      }
      actuales = [...actuales, ...validos.slice(0, Math.max(disponibles, 0))];
    }

    this.archivosDocumento[doc.id] = actuales;
    this.erroresDocumento[doc.id] = error;
  }

  quitarArchivo(doc: DocumentoSolicitud, index: number): void {
    this.archivosDocumento[doc.id] = this.archivosDe(doc).filter((_, i) => i !== index);
    this.erroresDocumento[doc.id] = '';

    // si ya no queda ningún archivo nuevo y el máximo es 1, se restauran los guardados
    if (this.maxDoc(doc) === 1 && this.archivosDe(doc).length === 0) {
      (this.anexosGuardados[doc.id] ?? []).forEach(a => this.anexosAEliminar.delete(a.id));
    }
  }

  private archivoABase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // "data:application/pdf;base64,AAAA..." → nos quedamos solo con lo que va después de la coma
        const resultado = reader.result as string;
        resolve(resultado.split(',')[1] ?? '');
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  private async construirAnexos(): Promise<{ iD_DOCUMENTO_REQ: number; archivo: string }[]> {
    const anexos: { iD_DOCUMENTO_REQ: number; archivo: string }[] = [];

    for (const doc of this.documentosRequeridos) {
      for (const file of this.archivosDe(doc)) {
        anexos.push({
          iD_DOCUMENTO_REQ: Number(doc.id),
          archivo: await this.archivoABase64(file)
        });
      }
    }
    return anexos;
  }

  descargarAnexo(anexo: AnexoGuardado): void {
    this.UserInteractionService.showLoading('Descargando...');

    this.service.descargarAnexo(anexo.id).subscribe({
      next: (resp) => {
        this.UserInteractionService.dismissLoading();

        const blob = resp.body;
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = anexo.nombrE_ORIGINAL;   // nombre original guardado
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar anexo:', err);
        this.UserInteractionService.dismissLoading();
        this.UserInteractionService.presentToast('No se pudo descargar el archivo');
      }
    });
  }

  seleccionarColaborador(c: any) {
    this.colaboradorSeleccionado = c;
    this.mostrarResultados = false;
    this.terminoBusqueda = '';
  }

  quitarColaborador() {
    this.colaboradorSeleccionado = null;
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.resultadosColaboradores = [];
    this.mostrarResultados = false;
  }

  private construirFormData(solicitud: any): FormData {
    const formData = new FormData();

    formData.append('SOLICITUD', JSON.stringify(solicitud));

    let indice = 0;
    for (const doc of this.documentosRequeridos) {
      for (const file of this.archivosDe(doc)) {
        formData.append(`ANEXOS[${indice}].ID_DOCUMENTO_REQ`, String(doc.id));
        formData.append(`ANEXOS[${indice}].ARCHIVO`, file, file.name);
        indice++;
      }
    }

    // Solo aplica al PUT
    if (this.solicitud) {
      Array.from(this.anexosAEliminar).forEach((id, i) => {
        formData.append(`ANEXOS_ELIMINAR[${i}]`, String(id));
      });
    }

    return formData;
  }

  async realizarSolicitud(): Promise<void> {
    if (!this.tipoSolicitudSeleccionado) return;

      if (this.formSolicitud.invalid || !this.documentosValidos) {
        this.formSolicitud.markAllAsTouched();
        return;
      }

      this.guardando = true;
      this.UserInteractionService.showLoading('Guardando...');

      try {
        const valores = this.formSolicitud.getRawValue();
        const param = await this.moduleService.getParam();
        const camposSolicitud = this.convertirCamposSolicitudALista(valores);

        const solicitud = this.solicitud
          ? {
              ID: this.solicitud.id,
              ID_TIPO_SOLICITUD: this.tipoSolicitudSeleccionado.id,
              ID_COLABORADOR: this.colaboradorSeleccionado?.id ?? Number(param.id_Colaborador),
              CAMPOS_SOLICITUD: camposSolicitud
            }
          : {
              ID: 0,
              ID_TIPO_SOLICITUD: this.tipoSolicitudSeleccionado.id,
              ID_COLABORADOR: Number(param.id_Colaborador),
              CAMPOS_SOLICITUD: camposSolicitud
            };

        const body = await this.construirFormData(solicitud);

        const peticion$ = this.solicitud
          ? this.service.putActualizarSolicitud(body)
          : this.service.postRealizarSolicitud(body);

        peticion$.subscribe({
          next: () => {
            this.guardando = false;
            this.UserInteractionService.dismissLoading();
            this.UserInteractionService.presentToast('Registro exitoso', TypeThemeColor.SUCCESS);
            this.volver();
          },
          error: (err) => {
            console.error('Error al enviar formulario:', err);
            this.guardando = false;
            this.UserInteractionService.dismissLoading();
            this.UserInteractionService.presentToast(
              err.error?.data?.error || 'Error desconocido, por favor contactese con el area encargada'
            );
          }
        });

      } catch (error) {
        console.error('Error preparando la solicitud:', error);
        this.guardando = false;
        this.UserInteractionService.dismissLoading();
        this.UserInteractionService.presentToast('No se pudieron leer los archivos adjuntos');
      }
  }

  aprobarRechazar(){
    let action :IAlertAction[] =[
      {
        text: 'Cancelar',
        handler: async () => {}
      }, 
      {
        text: 'Rechazar',
        handler: async (data) => {
          if(data.observacion){
            await this.aprobar(data.observacion,false);
            this.UserInteractionService.presentToast('Solicitud rechazada',TypeThemeColor.SUCCESS)
          }
          
        }
      },
      {
        text: 'Aprobar',
        handler: async (data) => {
          if(data.observacion){
            await this.aprobar(data.observacion,true);
            this.UserInteractionService.presentToast('Solicitud aprobada',TypeThemeColor.SUCCESS);
          }
        }
      }
    ]
    this.UserInteractionService.presentAlertActions(
      '¡Se ha realizado un cambio en el formulario!',
      action,
      false,
      'Notificación',
      [
        {
          name: 'observacion',
          type: 'textarea', 
          placeholder: 'Escriba su observación'
        }
      ]
    );
  }

  aprobar(observacion:string, aprobado:boolean){
    const datos = {
      ID:this.formSolicitud.get('id')?.value,
      aprobado: aprobado,
      coD_USER: 0,
      observacion: observacion
    }
    this.service.putActualizarEstadoSolicitud(datos).subscribe({
      next: async (resp) => {
        try {
          this.UserInteractionService.dismissLoading();
          this.UserInteractionService.presentToast('Registro exitoso', TypeThemeColor.SUCCESS);
        } catch (error) {
          console.error("Error al procesar respuesta:", error);
          this.UserInteractionService.dismissLoading();
        }
      },
      error: (err) => {
        console.error("Error al enviar formulario:", err);
        this.UserInteractionService.dismissLoading();
        this.UserInteractionService.presentToast(err.error.data.mensaje || err.error.data.error  || "Error desconocido, por favor contactese con el area encargada");
      }
    });
    this.volver();
  }

 
  limpiarSolicitud(): void {

    this.tipoSolicitudSeleccionado = null;
    this.documentosRequeridos = [];
    this.anexosGuardados = {};

    this.elementosHtml = [];

    this.formSolicitud =
      this.fb.group({});
  }

  volver(): void {

    console.log('URL antes:', this.router.url);
    console.log("form: ",this.formSolicitud.value)

  this.router.navigate(['/layout/panel-solicitudes']);
  }
}
