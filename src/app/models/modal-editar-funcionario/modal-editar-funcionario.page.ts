import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortalService } from 'src/services/portal.service';
import { ModuleService } from 'src/services/modulos/module.service';
import { ErrorMensajeComponent } from 'src/common/error-mensaje/error-mensaje.component';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { addIcons } from 'ionicons';
import { add, eye, pencil, close } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { UserInteractionService } from 'src/services/user-interaction-service.service';
import { TypeThemeColor } from 'src/app/enums/TypeThemeColor';
import { ComponenteBusquedaComponent } from 'src/app/components/componente-busqueda/componente-busqueda.component';
import { IAlertAction } from 'src/interfaces/IAlertOptions';

@Component({
  selector: 'app-modal-editar-funcionario',
  templateUrl: './modal-editar-funcionario.page.html',
  styleUrls: ['./modal-editar-funcionario.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ErrorMensajeComponent, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalEditarFuncionarioPage implements OnInit {
  @Input() idColaborador: number|undefined;
  @Input() editar: boolean|undefined;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  param:any
  empleadoForm: FormGroup = new FormGroup({});
  imagenSeleccionada: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;
  mostrarHijo:boolean=false;
  cargando: boolean = true;
  cargandoHijos: boolean = true;
  camposConfig: any[] = [];
  nivelesEducativos: any[] = [];
  profesiones: any[] = [];
  postgrado: any [] = [];
  tieneHijos: any[] = []
  generos: any[] = [];
  empresas: any[] = [];
  sedes: any[] = [];
  gerencias: any[] = [];
  areas: any[] = [];
  cargos: any[] = [];
  tipoNomnina: any[] = [];
  roles: any[] = [];
  tipoDotacion: any[] = [];
  nivelDotacion: any[] = [];
  estados: any[] = [];
  tipoRegistro: any[] = [];
  estadoCivil: any[] = [];
  tipoDocumento: any[] = [];
  rh: any[] = [];
  ciudadTrabajo: any[] = [];
  arl: any[] = [];
  jefes: any[] = [];
  razas: any[] = [];
  rubros:  any[] = [];
  sexos: any[] = [];
  orientaciones_Sexuales: any[] = [];
  discapacidades: any[] = [];
  apis: any[] = [];
  isModalOpen = false;
  
  constructor(private cdRef: ChangeDetectorRef, private fb: FormBuilder, private moduleService:ModuleService, 
    private service:PortalService, private modalCtrl: ModalController, private UserInteractionService: UserInteractionService
  ) { 
    addIcons({ pencil, eye, close, add}); 
    this.empleadoForm = this.fb.group({
      ID: [0, Validators.required],
      TIPO_IDENTIFICACION : [, [Validators.required, Validators.maxLength(50)]],
      IDENTIFICACION : ['', [Validators.required, Validators.maxLength(50)]],
      NOMBRES : ['', [Validators.required, Validators.maxLength(50)]],
      APELLIDOS : ['', [Validators.required, Validators.maxLength(50)]],
      GENERO : ['', Validators.required],
       ID_SEXO : [0,Validators.required],
      ID_ORIENTACION_SEXUAL: [0,Validators.required],
      ID_DISCAPACIDAD:[0,Validators.required],
      ID_RAZA: ['', Validators.required],
      RH : ['', [Validators.required, Validators.maxLength(3)]],
      FECHA_NACIMIENTO : ['', Validators.required],
      ID_NIVEL_EDUCATIVO : [0, Validators.required],
      ID_PROFESION : [[]],
      ID_PROFESION_ESCOGIDA: [''],
      ENTIDAD_PREGRADO: [''],
      ID_POSTGRADO: [[]],
      ID_POSTGRADO_ESCOGIDA: [''],
      TELEFONO_CELULAR : ['', [Validators.required, Validators.maxLength(11)]],
      CIUDAD_RESIDENCIA : ['', [Validators.required, Validators.maxLength(50)]],
      DIRECCION_RESIDENCIA : ['', [Validators.required, Validators.maxLength(100)]],
      TIENE_HIJOS : [, [Validators.required, Validators.maxLength(1)]],
      NOMBRE_CONTACTO : ['', [Validators.required, Validators.maxLength(100)]],
      TELEFONO_CONTACTO: ['', [Validators.required, Validators.maxLength(11)]],
      FECHA_INGRESO : ['', Validators.required],
      ID_EMPRESA : [, Validators.required],
      CIUDAD_TRABAJO : [''],
      ID_SEDE : [],
      ID_GERENCIA : [],
      ID_CCO:[],
      ID_AREA : [],
      ID_RUBRO : [],
      ID_CARGO : [],
      ID_TIPO_NOMINA : [],
      ID_ROL : [],
      ID_TIPO_DOTACION : [],
      ID_NIVEL_DOTACION : [],
      ENTIDAD_POSTGRADO: [''],
      CORREO_PERSONAL : ['', [Validators.required, Validators.email]],
      CORREO_CORPORATIVO: [''],
      PAZ_SALVO_ACTIVOS: [''],
      ENTREGA_TARJETA_INGRESO: [''],
      CAMBIO_CARGO: [''],
      FECHA_ACTUALIZACION: ['', Validators.required],
      ESTADO: [],
      ARL : ['', Validators.required],
      ID_ESTADO_CIVIL : [, Validators.required],
      ID_JEFE : [, Validators.required],
      APLICACIONES : [],
      HIJOS_COLABORADOR_JSON: this.fb.array([]) // Para agregar hijos dinámicamente
    });
  }

  convertirClavesMayus(obj: any): any {
    const nuevoObj: any = {};
    Object.keys(obj).forEach(key => {
      nuevoObj[key.toUpperCase()] = obj[key];
    });
    return nuevoObj;
  }

  async ngOnInit() {
    
    await this.colaboradores();
    await this.aplicativos();
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  async abrirModal(label:string, options:any, displayProperty:string, multiple:boolean) {
    console.log("options: ",options)
    const datos = await this.getDataSeleccion(label, options);
    const modal = await this.modalCtrl.create({
      component: ComponenteBusquedaComponent,
      componentProps: {
        label: label,
        options: options,
        selec:datos,
        displayProperty: displayProperty,
        multiple: multiple,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log(data)
    if (data) {
      if (multiple) {
        const idsSeleccionados = data.map((item: any) => item.id);
        this.empleadoForm.get(label)?.setValue(idsSeleccionados);
      } else {
        if (label === 'RH') {
          this.empleadoForm.get(label)?.setValue(data.descripcion);
        } else {
          this.empleadoForm.get(label)?.setValue(data.id);
        }
      }
    }

    this.isModalOpen = false;
  }
  
  async getDataSeleccion(label:string, opcion:any) {
    const id = this.empleadoForm.get(label)?.value;
    if(label=='RH'){
      const data = opcion.find((g:any) => g.descripcion === id);
      return data || '';
    } else if(Array.isArray(id)) {
      const descripciones = id
        .map((id: number) => opcion.find((o: any) => o.id === id))
        .filter(desc => !!desc); // Elimina undefined si no encuentra alguna
      return descripciones;
    }
    else{
      const data = opcion.find((g:any) => g.id === id);
      return data || '';
    }
  }

  getGeneroDescripcion(label:string, opcion:any): string {
    const id = this.empleadoForm.get(label)?.value;
    if(label=='RH'){
      const data = opcion.find((g:any) => g.descripcion === id);
      return data?.descripcion || '';
    } else if(Array.isArray(id)) {
      const descripciones = id
        .map((id: number) => opcion.find((o: any) => o.id === id)?.descripcion)
        .filter(desc => !!desc); // Elimina undefined si no encuentra alguna
      return descripciones.join(', ');
    } else{
      const data = opcion.find((g:any) => g.id === id);
      return data?.descripcion || '';
    }
  }



  getListaSeleccion(label: string, opciones: any[]): string[] {
    const valor = this.empleadoForm.get(label)?.value;

    if (!Array.isArray(valor)) return [];
    else if(label=='APLICACIONES'){
      return valor
        .map((id: number) => opciones.find((o: any) => o.id === id)?.aplicacion)
        .filter(desc => !!desc);
    }else{
      return valor
        .map((id: number) => opciones.find((o: any) => o.id === id)?.descripcion)
        .filter(desc => !!desc);
    }

  }

  async actualizarEstadoFormulario() {
    if (this.editar) {
      this.empleadoForm.enable();
    } else {
      this.empleadoForm.disable();
    }
  }

  async aplicativos(){
    this.UserInteractionService.showLoading('Consultando aplicativos...');
    this.service.getGetAplicativos().subscribe({
      next:async(resp)=>{
        try{
          this.apis=resp.data.datos.aplicativos
          this.UserInteractionService.dismissLoading();
        }catch(error){
          this.UserInteractionService.dismissLoading();
        }
      },error:(err)=>{
        this.UserInteractionService.dismissLoading();
        this.UserInteractionService.presentToast(err);
      }
    })
  }

  async colaboradores() {
    if(this.idColaborador){
      this.UserInteractionService.showLoading('Cargando...');
      this.service.getInfoColaboradores(this.idColaborador).subscribe({
        next:async(resp)=>{
          try{
            console.log("datos: ",resp.data.datos)

            // Llena el FormArray de hijos
            const datos = resp.data.datos;
            await this.consultaEstados(Number(datos.estado))
            if(datos.foto){
              console.log("entro")
              this.imagenPreview = `data:image/png;base64,${datos.foto}`;
            }
            datos.iD_PROFESION = this.convertirStringArray(datos.iD_PROFESION);
            datos.iD_POSTGRADO = this.convertirStringArray(datos.iD_POSTGRADO);

            // Luego aplicas patchValue con las claves en mayúscula si es necesario
            this.empleadoForm.patchValue(this.convertirClavesMayus(datos));
            const hijosFormArray = this.empleadoForm.get('HIJOS_COLABORADOR_JSON') as FormArray;
            hijosFormArray.clear();

            (resp.data.datos.hijoS_COLABORADOR || []).forEach((hijo: any) => {
              const hijoFormGroup = this.fb.group({
                ID: [hijo.id],
                ID_COLABORADOR: [hijo.iD_COLABORADOR],
                NOMBRE_COMPLETO: [hijo.nombrE_COMPLETO],
                EDAD: [hijo.edad],
                FECHA_NACIMIENTO: [hijo.fechA_NACIMIENTO],
                GENERO: [hijo.genero],
                RH: [hijo.rh],
                AñO_NACIMIENTO: [hijo.anO_NACIMIENTO],
                MES_NACIMIENTO: [hijo.meS_NACIMIENTO],
                DIA_NACIMIENTO: [hijo.diA_NACIMIENTO],
                DOCUMENTO: [hijo.documento],
                ID_TP_DOCUMENTO: [hijo.iD_TP_DOCUMENTO],
              });

              // ✅ Deshabilitar todo el grupo hijo
              hijoFormGroup.disable();

              hijosFormArray.push(hijoFormGroup);
            });

            // ✅ Mostrar formulario completo (incluye campos deshabilitados)
            console.log("form2 (raw): ", this.empleadoForm.getRawValue());

            // Obtener claves de hijos (opcional)
            const clavesHijos = Object.keys(hijosFormArray.controls[0]?.value || {});

            // ✅ Usa getRawValue() también aquí si necesitas recorrer el formulario completo
            const formCompleto = this.empleadoForm.getRawValue();
            Object.keys(formCompleto).forEach((key) => {
              if (key !== 'HIJOS_COLABORADOR_JSON') {
                console.log("raza: ",key)
                this.selec(key, 'idPadre');
              }
            });

            // Recorrer hijos normalmente
            for (let hijo of formCompleto.HIJOS_COLABORADOR_JSON || []) {
              Object.keys(hijo).forEach((key) => {
                this.selec(key);
              });
            }
            this.UserInteractionService.dismissLoading()

          }catch(error){
            console.error("Respuesta Login: ", error)
            this.UserInteractionService.dismissLoading()
          }
        },error:(err)=>{
          this.UserInteractionService.dismissLoading()
          this.UserInteractionService.presentToast(err);
        }
      })
    }
  }

  async consultaEstados(estado:number) {
    
    this.UserInteractionService.showLoading('Cargando...');
    this.service.getCamposEstado(estado).subscribe({
      next:async(resp)=>{
        try{
          this.camposConfig=resp.data.datos.listadoCampos
          await this.aplicarConfiguracionCampos();
          this.UserInteractionService.dismissLoading();
        }catch(error){
          this.UserInteractionService.dismissLoading();
        }
      },error:(err)=>{
        this.UserInteractionService.dismissLoading();
        this.UserInteractionService.presentToast(err);
      }
    })
  }

  getCampoConfig(nombreCampo: string) {
    const campo = this.camposConfig.find(
      c => c.campo.toLowerCase() === nombreCampo.toLowerCase()
    );

    if (!campo) {
      return { visible: false, editable: false, required: false };
    }

    const control = this.empleadoForm.get(campo.campo);

    if (control) {
      if (campo.activo !== 'S') {
        
          console.log('c.campo:',campo.campo)
          this.empleadoForm.removeControl(campo.campo);
      } if (campo.modificable === 'N') {
          control.enable({ emitEvent: false }); 
          control.markAsTouched({ onlySelf: true }); 
        } else {
          control.enable({ emitEvent: false });
        }
    }

    // Existe → definimos visibilidad y edición
    return {
      visible: campo.activo.toUpperCase() === 'S',
      editable: campo.modificable.toUpperCase() === 'S',
      required: this.esRequerido(nombreCampo)
    };
  }

  async aplicarConfiguracionCampos() {
    this.camposConfig.forEach(c => {
      const control = this.empleadoForm.get(c.campo);
      if (control) {
        if (c.activo.toUpperCase() !== 'S') {
          this.empleadoForm.removeControl(c.campo);
        } else {
          if (c.modificable.toUpperCase() === 'N') {
            control.enable({ emitEvent: false }); 
            control.markAsTouched({ onlySelf: true }); 
          } else {
            control.enable({ emitEvent: false });
          }
        }
      }
    });
    this.cargando = false;
    this.cargandoHijos = false;
  }

  // Ejemplo: si el campo está en el formulario y es requerido por defecto
  private esRequerido(nombreCampo: string): boolean {
    const control = this.empleadoForm.get(nombreCampo);
    if (!control) return false;
    return control.hasValidator(Validators.required);
  }

  convertirStringArray(cadena: any): number[] {
    try {
      if (typeof cadena === 'string') {
        const arr = JSON.parse(cadena);
        return Array.isArray(arr) ? arr.map(Number) : [];
      }
      return Array.isArray(cadena) ? cadena : [];
    } catch {
      return [];
    }
  }

  get fechaNacimientoControl(): FormControl {
    return this.empleadoForm.get('FECHA_NACIMIENTO') as FormControl;
  }

  get fechaFechaIngresoControl(): FormControl {
    return this.empleadoForm.get('FECHA_INGRESO') as FormControl;
  }

  getFechaHijoControl(index: number): FormControl {
    const hijoFormGroup = this.HIJOS_COLABORADOR_JSON.at(index) as FormGroup;
    return hijoFormGroup.get('FECHA_NACIMIENTO') as FormControl; // ¡Asegúrate de que el nombre del campo coincida!
  }


  selec(lista:string, dato?:string){
    this.param=this.moduleService.getFiltros();
    if (lista === 'ID_NIVEL_EDUCATIVO') {
      lista = 'nivelEducativo'
      this.nivelesEducativos = this.param[lista] || [];
    } else if (lista === 'ID_PROFESION') {
      lista = 'profesiones'
      this.profesiones = this.param[lista] || [];
    } else if (lista === 'ID_POSTGRADO') {
      lista = 'profesiones';
      this.postgrado = this.param[lista] || [];
    } else if (lista === 'GENERO') {
      lista = 'generos'
      this.generos = this.param[lista] || [];
    } else if (lista === 'ID_SEXO') {
      lista = 'sexos'
      this.sexos = this.param[lista] || [];
    } else if (lista === 'ID_ORIENTACION_SEXUAL') {
      lista = 'orientaciones_Sexuales'
      this.orientaciones_Sexuales = this.param[lista] || [];
    } else if (lista === 'ID_DISCAPACIDAD') {
      lista = 'discapacidades'
      this.discapacidades = this.param[lista] || [];
    } else if (lista === 'ID_RAZA') {
      lista = 'razas'
      console.log("raza: ",this.param)
      this.razas = this.param[lista] || [];
    } else if (lista === 'TIENE_HIJOS') {
      lista = 'tieneHijos'
      this.tieneHijos = this.param[lista] || [];
    } else if (lista === 'ID_EMPRESA') {
      lista = 'empresas'
      this.empresas = this.param[lista] || [];
    } else if (lista === 'ID_SEDE') {
      lista = 'sedes'
      this.sedes = this.param[lista] || [];
    } else if (lista === 'ID_GERENCIA') {
      lista = 'gerencias'
      this.gerencias = this.param[lista] || [];
    } else if (lista === 'ID_AREA') {
      lista = 'areas'
      this.areas = this.param[lista] || [];
    } else if (lista === 'ID_CARGO') {
      lista = 'cargos'
      this.cargos = this.param[lista] || [];
    } else if (lista === 'ID_TIPO_NOMINA') {
      lista = 'tipoNomnina'
      this.tipoNomnina = this.param[lista] || [];
    } else if (lista === 'ID_ROL') {
      lista = 'roles'
      this.roles = this.param[lista] || [];
    } else if (lista === 'ID_TIPO_DOTACION') {
      lista = 'tipoDotacion'
      this.tipoDotacion = this.param[lista] || [];
    } else if (lista === 'ID_NIVEL_DOTACION') {
      lista = 'nivelDotacion'
      this.nivelDotacion = this.param[lista] || [];
    } else if (lista === 'estados') {
      this.estados = this.param[lista] || [];
    } else if (lista === 'ID_TIPO_REGISTRO') {
      lista = 'tipoRegistro'
      this.tipoRegistro = this.param[lista] || [];
    } else if (lista === 'ID_ESTADO_CIVIL') {
      lista = 'estadoCivil'
      this.estadoCivil = this.param[lista] || [];
    } else if (lista === 'ID_TP_DOCUMENTO' && dato !='idPadre') {
      lista = 'tipoIdentificacion'
      
      this.tipoDocumento = this.param[lista] || [];
    } else if (lista === 'TIPO_IDENTIFICACION' && dato =='idPadre') {
      lista = 'tipoIdentificacion'
      this.tipoDocumento = this.param[lista] || [];
    } else if (lista === 'RH' && dato =='idPadre') {
      lista = 'rh'
      this.rh = this.param[lista] || [];
    } else if (lista === 'RH' && dato !='idPadre') {
      lista = 'rh'
      this.rh = this.param[lista] || [];
    } else if (lista === 'ARL') {
      lista = 'arl'
      this.arl = this.param[lista] || [];
    } else if (lista === 'CIUDAD_TRABAJO') {
      lista = 'ciudadTrabajo'
      this.ciudadTrabajo = this.param[lista] || [];
    } else if (lista === 'ID_JEFE') {
      lista = 'jefes'
      this.jefes = this.param[lista] || [];
    } else if (lista === 'ID_RUBRO') {
      lista = 'rubros'
      this.rubros = this.param[lista] || [];
    } 
    
  }


  hijoForm(): FormGroup {
    return this.fb.group({
      ID: [0],
      ID_COLABORADOR: [0],
      NOMBRE_COMPLETO: ['', Validators.required],
      EDAD: ['', Validators.required],
      FECHA_NACIMIENTO: ['', Validators.required],
      GENERO: ['', Validators.required],
      RH: ['', Validators.required],
      AñO_NACIMIENTO: [''],
      MES_NACIMIENTO: [''],
      DIA_NACIMIENTO: [''],
      DOCUMENTO: ['', Validators.required],
      ID_TP_DOCUMENTO: [0, Validators.required]
    });
  }

  validadorListas(){

  }

  get HIJOS_COLABORADOR_JSON(): FormArray {
    return this.empleadoForm.get('HIJOS_COLABORADOR_JSON') as FormArray;
  }

  mostrarError(fieldName: string): boolean {
    const control = this.empleadoForm.get(fieldName);
    return control?.invalid && control?.touched ? true : false;
  }

  agregarHijo() {
    this.HIJOS_COLABORADOR_JSON.push(this.hijoForm());
  }

  eliminarHijo(index: number) {
    this.HIJOS_COLABORADOR_JSON.removeAt(index);
  }

  motrarHijos(){
    this.mostrarHijo=!this.mostrarHijo
    this.cargandoHijos=true
    console.log(this.empleadoForm.value)
  }

  onFechaNacimientoChange(event: any) {
    const fechaCompleta = new Date(event.detail.value);
    const fechaSinHora = fechaCompleta.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    this.empleadoForm.patchValue({
      FECHA_NACIMIENTO: fechaSinHora
    });
  }

  onFechaNacimientoHijoChange(event: any, index: number) {
    const fechaCompleta = new Date(event.detail.value);
    const fechaSinHora = fechaCompleta.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    this.HIJOS_COLABORADOR_JSON.at(index).get('FECHA_NACIMIENTO')?.setValue(fechaSinHora);
  }

  onFechaIngresoChange(event: any) {
    const fechaCompleta = new Date(event.detail.value);
    const fechaSinHora = fechaCompleta.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    this.empleadoForm.patchValue({
      FECHA_INGRESO: fechaSinHora
    });
  }

  onFechaActualizacionChange(event: any) {
    const fechaCompleta = new Date(event.detail.value);
    const fechaSinHora = fechaCompleta.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    this.empleadoForm.patchValue({
      FECHA_ACTUALIZACION: fechaSinHora
    });
  }

  async guardarEmpleado() {
    console.log("datos: ",this.empleadoForm.value)
    // if (this.empleadoForm.invalid) {
    //   this.empleadoForm.markAllAsTouched();
    //   return;
    // }

    // if (this.empleadoForm.valid) {
      const hoy = new Date();
      const fechaFormateada = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
      this.empleadoForm.patchValue({
        FECHA_ACTUALIZACION: fechaFormateada
      });
      const formData = new FormData();

      Object.keys(this.empleadoForm.value).forEach((key) => {
        if (
          this.empleadoForm.value[key] !== null &&
          this.empleadoForm.value[key] !== undefined &&
          key !== 'HIJOS_COLABORADOR_JSON' &&
          key !== 'ID_PROFESION' &&
          key !== 'ID_POSTGRADO' && 
          key !=='APLICACIONES'
        ) {
          formData.append(key, this.empleadoForm.value[key]);
        }
      });

      // HIJOS_COLABORADOR_JSON
      const hijosJson = JSON.stringify(this.HIJOS_COLABORADOR_JSON.value);
      formData.append('HIJOS_COLABORADOR_JSON', hijosJson);

      // ID_PROFESION uno por uno
      
    console.log("DATA: ",this.empleadoForm.value)
      const profesionesSeleccionadas: number[] = this.empleadoForm.get('ID_PROFESION')?.value || [];
      profesionesSeleccionadas.forEach((id: number) => {
        formData.append('ID_PROFESION', id.toString());
      });

      const postgradoSeleccionadas: number[] = this.empleadoForm.get('ID_POSTGRADO')?.value || [];
      postgradoSeleccionadas.forEach((id: number) => {
        formData.append('ID_POSTGRADO', id.toString());
      });

      const aplicacionesSeleccionadas: number[] = this.empleadoForm.get('APLICACIONES')?.value || [];
      aplicacionesSeleccionadas.forEach((id: number) => {
        formData.append('APLICACIONES', id.toString());
      });

      if (this.imagenSeleccionada) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (ctx) {
              ctx.drawImage(img, 0, 0);

              // Convertimos a Blob en formato JPEG
              canvas.toBlob(async (blob) => {
                if (blob) {
                  const jpgFile = new File([blob], 'imagen.jpg', { type: 'image/jpeg' });

                  // 🔹 Crear nuevo FormData en el formato requerido
                  const nuevoFormData = new FormData();
                  nuevoFormData.append('ESTADO', formData.get('ESTADO') || '');
                  nuevoFormData.append('Foto', jpgFile);

                  // Construir ModeloJson manteniendo arrays si hay claves repetidas
                  const modelo: any = {};
                  formData.forEach((valor, clave) => {
                    if (clave !== 'foto') {
                      if (modelo[clave]) {
                        if (!Array.isArray(modelo[clave])) {
                          modelo[clave] = [modelo[clave]];
                        }
                        modelo[clave].push(valor);
                      } else {
                        modelo[clave] = valor;
                      }
                    }
                  });

                  nuevoFormData.append('ModeloJson', JSON.stringify(modelo));

                  // Depuración opcional
                  console.log("ModeloJson:", modelo);
                  nuevoFormData.forEach((valor, clave) => {
                    console.log(`${clave}:`, valor);
                  });

                  await this.enviar(nuevoFormData);
                } else {
                  console.error("No se pudo convertir la imagen a blob.");
                }
              }, 'image/jpeg');
            }
          };

          img.src = e.target.result; // Cargar imagen desde base64
        };

        reader.readAsDataURL(this.imagenSeleccionada); // Leer imagen como base64
        } else {
        // 🔹 Si no hay imagen, también adaptamos al nuevo formato
        const nuevoFormData = new FormData();
        nuevoFormData.append('ESTADO', formData.get('ESTADO') || '');

        const modelo: any = {};
        formData.forEach((valor, clave) => {
          if (clave !== 'foto') {
            if (modelo[clave]) {
              if (!Array.isArray(modelo[clave])) {
                modelo[clave] = [modelo[clave]];
              }
              modelo[clave].push(valor);
            } else {
              modelo[clave] = valor;
            }
          }
        });

        nuevoFormData.append('ModeloJson', JSON.stringify(modelo));

        console.log("ModeloJson:", modelo);
        await this.enviar(nuevoFormData);
        }
  }

  async enviar(formData:any){
    this.UserInteractionService.showLoading('Guardando...');
      this.service.putActualizarColaborador(formData).subscribe({
        next: async (resp) => {
          try {
            this.UserInteractionService.dismissLoading();
            console.log("Respuesta:", resp);
            let action2 :IAlertAction[] =[
              {
                text: 'Cancelar',
                handler: async () => {}
              }, 
              {
                text: 'Rechazar',
                handler: async (data) => {
                  await this.aprobar(data.observacion,'R');
                  this.UserInteractionService.presentToast('Usuario editado con exito, pero no aprobado',TypeThemeColor.SUCCESS);
                }
              }
            ]

            let action :IAlertAction[] =[
              {
                text: 'Rechazar',
                handler: async () => {
                  this.UserInteractionService.presentAlertActions(
                  '¡Se ha realizado un cambio en el formulario!',
                  action2)
                }
              },
              {
                text: 'Aprobar',
                handler: async (data) => {
                  await this.aprobar(data.observacion,'A');
                  this.UserInteractionService.presentToast('Usuario editado con exito',TypeThemeColor.SUCCESS);
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
          } catch (error) {
            console.error("Error al procesar respuesta:", error);
            this.UserInteractionService.dismissLoading();
            this.cerrarModal();
          }
        },
        error: (err) => {
          console.error("Error al enviar formulario:", err);
          this.UserInteractionService.dismissLoading();
          this.UserInteractionService.presentToast(err);
          this.cerrarModal();
        }
      });
  }

  async aprobar(observacion:string, tipo:string){
    const params = this.empleadoForm.get('IDENTIFICACION')?.value || '';
    const data ={
      identificacion: Number(params),
      observacion:observacion,
      tipo:tipo
    }
    this.service.postAprobarRechazarColaborador(data).subscribe({
        next: async (resp) => {
          try {
            console.log("Respuesta:", resp);
            this.UserInteractionService.dismissLoading();
            this.cerrarModal();
          } catch (error) {
            console.error("Error al procesar respuesta:", error);
            this.UserInteractionService.dismissLoading();
            this.cerrarModal();
          }
        },
        error: (err) => {
          console.error("Error al enviar formulario:", err);
          this.UserInteractionService.dismissLoading();
          this.UserInteractionService.presentToast(err);
          this.cerrarModal();
        }
      });
  }

  
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  
  // Carga la imagen seleccionada
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Borra la imagen seleccionada
  borrarImagen() {
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
    this.fileInput.nativeElement.value = '';
  }
  cerrarModal() {
    this.modalCtrl.dismiss();
  }


}
