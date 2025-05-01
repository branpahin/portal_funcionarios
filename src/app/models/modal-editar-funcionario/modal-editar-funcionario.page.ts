import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortalService } from 'src/services/portal.service';
import { ModuleService } from 'src/services/modulos/module.service';
import { ErrorMensajeComponent } from 'src/common/error-mensaje/error-mensaje.component';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';

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
  parentesco: any[] = [];
  tipoDocumento: any[] = [];
  rh: any[] = [];
  ciudadTrabajo: any[] = [];
  arl: any[] = [];

  constructor(private cdRef: ChangeDetectorRef, private fb: FormBuilder, private moduleService:ModuleService, private service:PortalService,
  ) { 
    this.empleadoForm = this.fb.group({
      ID: [0, Validators.required],
      ID_TIPO_REGISTRO: [, Validators.required],
      TIPO_IDENTIFICACION : [, [Validators.required, Validators.maxLength(50)]],
      IDENTIFICACION : ['', [Validators.required, Validators.maxLength(50)]],
      NOMBRES : ['', [Validators.required, Validators.maxLength(50)]],
      APELLIDOS : ['', [Validators.required, Validators.maxLength(50)]],
      GENERO : ['', [Validators.required, Validators.maxLength(1)]],
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
      ID_AREA : [],
      ID_CARGO : [],
      ID_TIPO_NOMINA : [],
      ID_ROL : [],
      ID_TIPO_DOTACION : [],
      ID_NIVEL_DOTACION : [],
      ENTIDAD_POSTGRADO: [''],
      CORREO_PERSONAL : ['', [Validators.required, Validators.email]],
      CORREO_CORPORATIVO: ['', Validators.email],
      PAZ_SALVO_ACTIVOS: [''],
      ENTREGA_TARJETA_INGRESO: [''],
      CAMBIO_CARGO: [''],
      FECHA_ACTUALIZACION: ['', Validators.required],
      ESTADO: [],
      ARL : ['', Validators.required],
      ID_ESTADO_CIVIL : [, Validators.required],
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
    this.cdRef.detectChanges();
    this.actualizarEstadoFormulario()
  }

  ngAfterViewInit() {
    // Forzar la detección de cambios después de que la vista se haya renderizado
    this.cdRef.detectChanges();
  }

  actualizarEstadoFormulario() {
    if (this.editar) {
      this.empleadoForm.enable();
    } else {
      this.empleadoForm.disable();
    }
  }

  async colaboradores() {
    if(this.idColaborador){
      this.service.getInfoColaboradores(this.idColaborador).subscribe({
        next:async(resp)=>{
          try{
            this.empleadoForm.patchValue(this.convertirClavesMayus(resp.data.datos));
            const hijosFormArray = this.empleadoForm.get('HIJOS_COLABORADOR_JSON') as FormArray;

            resp.data.datos.hijoS_COLABORADOR.forEach((hijo:any) => {
              hijosFormArray.push(this.fb.group({
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
                ID_PARENTESCO: [hijo.iD_PARENTESCO],
                DOCUMENTO: [hijo.documento],
                ID_TP_DOCUMENTO: [hijo.iD_TP_DOCUMENTO],
              }));
            });
            const clavesHijos = Object.keys(hijosFormArray.controls[0]?.value || {});
            Object.keys(this.empleadoForm.value).forEach((key) => {
        
                this.selec(key, 'idPadre');

            });

            for(let hijo of hijosFormArray.value){
              Object.keys(hijo).forEach((key) => {
                this.selec(key);
                  console.log("Hijo: ",key)
                  this.selec(key);
              });
            }


            console.log("form: ",this.empleadoForm.value)
          }catch(error){
            console.error("Respuesta Login: ", error)
          }
        }
      })
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
    } else if (lista === 'ID_PARENTESCO' && dato !='idPadre') {
      lista = 'parentezco'
      this.parentesco = this.param[lista] || [];
      console.log("parentesco: ",this.parentesco)
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
      ID_PARENTESCO: [0, Validators.required],
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

  guardarEmpleado() {
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
          key !== 'HIJOS_COLABORADOR_JSON'
        ) {
          formData.append(`${key}`, this.empleadoForm.value[key]);
        }
      });
      const hijosJson = JSON.stringify(this.HIJOS_COLABORADOR_JSON.value);
      formData.append('HIJOS_COLABORADOR_JSON', hijosJson);

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
              canvas.toBlob((blob) => {
                if (blob) {
                  const jpgFile = new File([blob], 'imagen.jpg', { type: 'image/jpeg' });
      
                  // Agregamos la imagen ya transformada
                  formData.append('foto', jpgFile);
      
                  // ✅ Importante: el post debe ir AQUÍ
                  this.service.putActualizarColaborador(formData).subscribe({
                    next: async (resp) => {
                      try {
                        console.log("Respuesta:", resp);
                      } catch (error) {
                        console.error("Error al procesar respuesta:", error);
                      }
                    },
                    error: (err) => {
                      console.error("Error al enviar formulario:", err);
                    }
                  });
                } else {
                  console.error("No se pudo convertir la imagen a blob.");
                }
              }, 'image/jpeg');
            }
          };
      
          // Cargar imagen desde base64
          img.src = e.target.result;
        };
      
        // Leer la imagen original como base64
        reader.readAsDataURL(this.imagenSeleccionada);
      }

      console.log(this.empleadoForm.value);
    // } else {
    //   console.log(this.empleadoForm.value);
    //   console.log('Formulario inválido');
    // }
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


}
