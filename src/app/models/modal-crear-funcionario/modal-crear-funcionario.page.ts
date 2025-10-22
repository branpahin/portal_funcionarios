import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModuleService } from 'src/services/modulos/module.service';
import { IONIC_COMPONENTS } from 'src/app/imports/ionic-imports';
import { ErrorMensajeComponent } from 'src/common/error-mensaje/error-mensaje.component';
import { PortalService } from 'src/services/portal.service';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, eye, pencil, close } from 'ionicons/icons';
import { UserInteractionService } from 'src/services/user-interaction-service.service';
import { TypeThemeColor } from 'src/app/enums/TypeThemeColor';
import { BuscadorSelectWrapperComponent } from 'src/app/components/buscador-select-wrapper/buscador-select-wrapper.component';
import { ComponenteBusquedaComponent } from 'src/app/components/componente-busqueda/componente-busqueda.component';
import { PermisosService } from 'src/services/permisos.service';
import { IAlertAction } from 'src/interfaces/IAlertOptions';

@Component({
  selector: 'app-modal-crear-funcionario',
  templateUrl: './modal-crear-funcionario.page.html',
  styleUrls: ['./modal-crear-funcionario.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ErrorMensajeComponent, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalCrearFuncionarioPage implements OnInit {
  @Input() empleadoForm: FormGroup = new FormGroup({});
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  idCiudad:number=0
  idGerencia:number=0
  param:any
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
  cco: any[] = [];
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


  isModalOpen = false;

  constructor(private fb: FormBuilder, private moduleService:ModuleService, private service:PortalService, 
    private modalCtrl: ModalController, private UserInteractionService: UserInteractionService,
    public permisosService: PermisosService) 
  {
    addIcons({ pencil, eye, close, add}); 
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

  get HIJOS_COLABORADOR_JSON(): FormArray {
    return this.empleadoForm.get('HIJOS_COLABORADOR_JSON') as FormArray;
  }

  mostrarError(fieldName: string): boolean {
    const control = this.empleadoForm.get(fieldName);
    return control?.invalid && control?.touched ? true : false;
  }

  ngOnInit() {
    this.param=this.moduleService.getFiltros();
    this.empleadoForm.get('TIENE_HIJOS')?.valueChanges.subscribe(value => {
      if (value === 1) { // Suponiendo que "1" significa "Sí, tiene hijos"
        this.agregarHijo(); // Llamamos a la función para agregar el formulario de hijos
        this.motrarHijos();
      } else {
        this.HIJOS_COLABORADOR_JSON.clear(); // Eliminamos cualquier hijo si la respuesta es "No"
      }
    });
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
    const day = String(hoy.getDate()).padStart(2, '0');

    const fechaFormateada = `${year}-${month}-${day}`;
  
    this.empleadoForm.patchValue({
      FECHA_ACTUALIZACION: fechaFormateada
    });
    this.cargarTodosLosFiltros();
  }

  
  async abrirModal(label:string, options:any, displayProperty:string, multiple:boolean) {
    const datos = await this.getDataSeleccion(label, options);
    console.log("datos: ",options)
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
        } else if(label === 'CIUDAD_TRABAJO'){
          this.empleadoForm.get(label)?.setValue(data.id);
          this.idCiudad=data.id
          this.gerencia(data.id)
        } else if(label === 'ID_GERENCIA'){
          this.empleadoForm.get(label)?.setValue(data.id);
          this.area(this.idCiudad,data.id)
          this.idGerencia=data.id
        } else if(label === 'ID_AREA'){
          this.empleadoForm.get(label)?.setValue(data.id);
          this.CCO(this.idCiudad,this.idGerencia,data.id)
        }
        else {
          this.empleadoForm.get(label)?.setValue(data.id);
        }
      }
    }

    this.isModalOpen = false;
  }

  async gerencia(idCiudad:number){
    this.UserInteractionService.showLoading('Consultando...');
    this.service.getGerencias(idCiudad).subscribe({
        next:async(resp)=>{
          try{
            console.log("resp: ",resp)
            this.gerencias =resp.data.datos.gerencias
            this.param['gerencias'] = [...this.gerencias];
            console.log("params: ",this.param)
            this.UserInteractionService.dismissLoading();
          }catch(error){
            console.error("Respuesta Login: ", error)
            this.UserInteractionService.dismissLoading();
          }
        },error:(err)=>{
          this.UserInteractionService.dismissLoading();
          this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
        }

      })
  }

  async area(idCiudad:number, idGerencia:number){
    this.UserInteractionService.showLoading('Consultando...');
    this.service.getAreas(idCiudad, idGerencia).subscribe({
        next:async(resp)=>{
          try{
            console.log("resp: ",resp)
            this.areas =resp.data.datos.areas
            this.param['areas'] = [...this.areas];
            console.log("params: ",this.param)
            this.UserInteractionService.dismissLoading();
          }catch(error){
            console.error("Respuesta Login: ", error)
            this.UserInteractionService.dismissLoading();
          }
        },error:(err)=>{
          this.UserInteractionService.dismissLoading();
          this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
        }

      })
  }

  async CCO(idCiudad:number, idGerencia:number, idArea:number){
    this.UserInteractionService.showLoading('Consultando...');
    this.service.getCCO(idCiudad,idGerencia,idArea).subscribe({
        next:async(resp)=>{
          try{
            console.log("resp: ",resp)
            this.cco =resp.data.datos.areas
            this.UserInteractionService.dismissLoading();
          }catch(error){
            console.error("Respuesta Login: ", error)
            this.UserInteractionService.dismissLoading();
          }
        },error:(err)=>{
          this.UserInteractionService.dismissLoading();
          this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
        }

      })
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

    return valor
      .map((id: number) => opciones.find((o: any) => o.id === id)?.descripcion)
      .filter(desc => !!desc);
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

  

  async guardarEmpleado() {
    const rol =  Number(localStorage.getItem('rolSeleccionado'));
    if (this.empleadoForm.invalid) {
      this.empleadoForm.markAllAsTouched();
      return;
    }
    if (this.empleadoForm.valid) {
      console.log("entro")
      if (this.imagenSeleccionada) {
        if(rol==2){
          await this.enviarColaboradorInterventor()
        }else{
          await this.enviar();
        }
      }else{
        this.UserInteractionService.dismissLoading();
          let action :IAlertAction[] =[
            {
              text: 'Cancelar',
              handler: async () => {}
            }, 
            {
              text: 'Si, enviar',
              handler: async () => {
                if(rol==2){
                  await this.enviarColaboradorInterventor()
                }else{
                  await this.enviar();
                }
              }
            }
          ]
          this.UserInteractionService.presentAlertActions(
            'El colaborador no tiene foto, ¿desea enviar así?',
            action,
            false,
            'Notificación'
          );
      }

      console.log(this.empleadoForm.value);
    }
  }

  async enviar(){
    const formData = new FormData();
    Object.keys(this.empleadoForm.value).forEach((key) => {
      if (
        this.empleadoForm.value[key] !== null &&
        this.empleadoForm.value[key] !== undefined &&
        key !== 'HIJOS_COLABORADOR_JSON' &&
        key !== 'ID_PROFESION' &&
        key !== 'ID_POSTGRADO'
      ) {
        formData.append(key, this.empleadoForm.value[key]);
      }
    });

    // HIJOS_COLABORADOR_JSON
    const hijosJson = JSON.stringify(this.HIJOS_COLABORADOR_JSON.value);
    formData.append('HIJOS_COLABORADOR_JSON', hijosJson);
    const profesionesSeleccionadas: number[] = this.empleadoForm.get('ID_PROFESION')?.value || [];
    profesionesSeleccionadas.forEach((id: number) => {
      formData.append('ID_PROFESION', id.toString());
    });

    const postgradoSeleccionadas: number[] = this.empleadoForm.get('ID_POSTGRADO')?.value || [];
    postgradoSeleccionadas.forEach((id: number) => {
      formData.append('ID_POSTGRADO', id.toString());
    });

  
    // Leer la imagen original como base64
    if(this.imagenSeleccionada){
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
                this.UserInteractionService.showLoading('Guardando...');
                this.service.postCrearColaborador(formData).subscribe({
                  next: async (resp) => {
                    try {
                      console.log("Respuesta:", resp);
                      this.UserInteractionService.dismissLoading();
                      this.UserInteractionService.presentToast('Usuario creado con exito', TypeThemeColor.SUCCESS);
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
                    this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
                    this.cerrarModal();
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
      reader.readAsDataURL(this.imagenSeleccionada);
    }else{
      this.UserInteractionService.showLoading('Guardando...');
      this.service.postCrearColaborador(formData).subscribe({
        next: async (resp) => {
          try {
            console.log("Respuesta:", resp);
            this.UserInteractionService.dismissLoading();
            this.UserInteractionService.presentToast('Usuario creado con exito', TypeThemeColor.SUCCESS);
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
          this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
          this.cerrarModal();
        }
      });
    }
  }

  async enviarColaboradorInterventor(){
    const formData = new FormData();
    Object.keys(this.empleadoForm.value).forEach((key) => {
      if (
        this.empleadoForm.value[key] !== null &&
        this.empleadoForm.value[key] !== undefined &&
        key !== 'HIJOS_COLABORADOR_JSON' &&
        key !== 'ID_PROFESION' &&
        key !== 'ID_POSTGRADO'
      ) {
        formData.append(key, this.empleadoForm.value[key]);
      }
    });

    // HIJOS_COLABORADOR_JSON
    // const hijosJson = JSON.stringify(this.HIJOS_COLABORADOR_JSON.value);
    // formData.append('HIJOS_COLABORADOR_JSON', hijosJson);
    // const profesionesSeleccionadas: number[] = this.empleadoForm.get('ID_PROFESION')?.value || [];
    // profesionesSeleccionadas.forEach((id: number) => {
    //   formData.append('ID_PROFESION', id.toString());
    // });

    // const postgradoSeleccionadas: number[] = this.empleadoForm.get('ID_POSTGRADO')?.value || [];
    // postgradoSeleccionadas.forEach((id: number) => {
    //   formData.append('ID_POSTGRADO', id.toString());
    // });

  
    // Leer la imagen original como base64
    if(this.imagenSeleccionada){
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
                this.UserInteractionService.showLoading('Guardando...');
                this.service.postCrearColaboradorInterventor(formData).subscribe({
                  next: async (resp) => {
                    try {
                      console.log("Respuesta:", resp);
                      this.UserInteractionService.dismissLoading();
                      this.UserInteractionService.presentToast('Usuario creado con exito', TypeThemeColor.SUCCESS);
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
                    this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
                    this.cerrarModal();
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
      reader.readAsDataURL(this.imagenSeleccionada);
    }else{
      this.UserInteractionService.showLoading('Guardando...');
      this.service.postCrearColaboradorInterventor(formData).subscribe({
        next: async (resp) => {
          try {
            console.log("Respuesta:", resp);
            this.UserInteractionService.dismissLoading();
            this.UserInteractionService.presentToast('Usuario creado con exito', TypeThemeColor.SUCCESS);
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
          this.UserInteractionService.presentToast(err.error.data.error || "Error desconocido, por favor contactese con el area encargada");
          this.cerrarModal();
        }
      });
    }
  }

  cargarTodosLosFiltros() {
    const listasSimples = [
      'nivelEducativo',
      'profesiones',
      'postgrado',
      'generos',
      'sexos',
      'orientaciones_Sexuales',
      'discapacidades',
      'rubros',
      'tieneHijos',
      'empresas',
      'sedes',
      'gerencias',
      'areas',
      'cargos',
      'tipoNomnina',
      'roles',
      'tipoDotacion',
      'nivelDotacion',
      'jefes',
      'tipoRegistro',
      'estadoCivil',
      'arl',
      'ciudadTrabajo',
      'razas'
    ];

    listasSimples.forEach(nombre => this.selec(nombre));

    this.selec('tipoIdentificacion', 'idPadre');
    this.selec('tipoIdentificacion');
    this.selec('rh', 'idPadre');
    this.selec('rh');
  }

  selec(lista:string, dato?:string){
    if (lista === 'nivelEducativo') {
      this.nivelesEducativos = this.param[lista] || [];
    } else if (lista === 'profesiones') {
      this.profesiones = this.param[lista] || [];
    } else if (lista === 'postgrado') {
      lista="profesiones";
      this.postgrado = this.param[lista] || [];
    } else if (lista === 'generos') {
      this.generos = this.param[lista] || [];
    } else if (lista === 'sexos') {
      this.sexos = this.param[lista] || [];
    } else if (lista === 'orientaciones_Sexuales') {
      this.orientaciones_Sexuales = this.param[lista] || [];
    } else if (lista === 'discapacidades') {
      this.discapacidades = this.param[lista] || [];
    } else if (lista === 'razas') {
      this.razas = this.param[lista] || [];
    } else if (lista === 'tieneHijos') {
      this.tieneHijos = this.param[lista] || [];
    } else if (lista === 'empresas') {
      this.empresas = this.param[lista] || [];
    } else if (lista === 'sedes') {
      this.sedes = this.param[lista] || [];
    } else if (lista === 'gerencias') {
      this.gerencias = this.param[lista] || [];
    } else if (lista === 'areas') {
      this.areas = this.param[lista] || [];
    } else if (lista === 'cargos') {
      this.cargos = this.param[lista] || [];
    } else if (lista === 'tipoNomnina') {
      this.tipoNomnina = this.param[lista] || [];
    } else if (lista === 'roles') {
      this.roles = this.param[lista] || [];
    } else if (lista === 'tipoDotacion') {
      this.tipoDotacion = this.param[lista] || [];
    } else if (lista === 'nivelDotacion') {
      this.nivelDotacion = this.param[lista] || [];
    } else if (lista === 'jefes') {
      this.jefes = this.param[lista] || [];
    } else if (lista === 'tipoRegistro') {
      this.tipoRegistro = this.param[lista] || [];
    } else if (lista === 'estadoCivil') {
      this.estadoCivil = this.param[lista] || [];
    } else if (lista === 'tipoIdentificacion' && dato =='idPadre') {
      this.tipoDocumento = this.param[lista] || [];
    } else if (lista === 'tipoIdentificacion' && dato !='idPadre') {
      this.tipoDocumento = this.param[lista] || [];
    } else if (lista === 'rh' && dato =='idPadre') {
      this.rh = this.param[lista] || [];
    } else if (lista === 'rh' && dato !='idPadre') {
      this.rh = this.param[lista] || [];
    } else if (lista === 'arl') {
      this.arl = this.param[lista] || [];
    } else if (lista === 'ciudadTrabajo') {
      this.ciudadTrabajo = this.param[lista] || [];
    } else if (lista === 'rubros') {
      this.rubros = this.param[lista] || [];
    } 
    
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
