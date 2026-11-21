import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleService } from 'src/services/modulos/module.service';
import { IONIC_COMPONENTS } from '../../imports/ionic-imports';
import { PortalService } from 'src/services/portal.service';
import { ModalController } from '@ionic/angular';
import { ModalCrearFiltroPage } from 'src/app/models/modal-crear-filtro/modal-crear-filtro.page';
import { PermisosService } from 'src/services/permisos.service';
import { ModalCrearSolicitudPage } from 'src/app/models/modal-crear-solicitud/modal-crear-solicitud.page';
import { SecureStorageService } from 'src/services/secure-storage.service';

interface Beneficio {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  etiqueta: string;
  textoBoton: string;
}

@Component({
  selector: 'app-portal-beneficios',
  templateUrl: './portal-beneficios.page.html',
  styleUrls: ['./portal-beneficios.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IONIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PortalBeneficiosPage implements OnInit {
  
  indiceActual = 0;
  private intervalo: any;
  busqueda = '';
 
  beneficios = [
    {
      tituloScript: 'Conoce tus',
      titulo: 'beneficios',
      imagen: 'assets/img/hero-1.jpg',
    },
    {
      tituloScript: 'Descubre tus',
      titulo: 'convenios',
      imagen: 'assets/img/hero-2.jpg',
    },
    {
      tituloScript: 'Crece con tus',
      titulo: 'programas',
      imagen: 'assets/img/hero-3.jpg',
    },
    {
      tituloScript: 'Disfruta tu',
      titulo: 'bienestar',
      imagen: 'assets/img/hero-4.jpg',
    },
    {
      tituloScript: 'Vive tu',
      titulo: 'bienestar',
      imagen: 'assets/img/hero-5.jpg',
    },
  ];
 
  // ---------- Plan de beneficios ----------
  planBeneficios = [
    { nombre: 'Físico', icono: 'heart-outline', color: '#d6397b' },
    { nombre: 'Emocional y mental', icono: 'bulb-outline', color: '#7b3fa0' },
    { nombre: 'Espiritual', icono: 'body-outline', color: '#4b3a9c' },
    { nombre: 'Financiero', icono: 'cash-outline', color: '#1aa6c9' },
    { nombre: 'Profesional', icono: 'briefcase-outline', color: '#1a9d8f' },
    { nombre: 'Vocacional', icono: 'compass-outline', color: '#86a41e' },
  ];
 
  // ---------- Programas de formación ----------
  programas = [
    { nombre: 'Blandas', imagen: 'assets/img/formacion-blandas.jpg' },
    { nombre: 'Técnicas', imagen: 'assets/img/formacion-tecnicas.jpg' },
    { nombre: 'De gestión empresarial', imagen: 'assets/img/formacion-gestion.jpg' },
    { nombre: 'Normativas y de regulación', imagen: 'assets/img/formacion-normativas.jpg' },
  ];
 
  // ---------- Convenios ----------
  convenios = [
    {
      nombre: 'Restaurante 1',
      logo: 'assets/img/convenio-1.png',
      descuento: '15% y 20%',
      detalle: 'En la carta y el día de tu cumpleaños',
    },
    {
      nombre: 'Burger Green',
      logo: 'assets/img/convenio-burger.png',
      descuento: '10%',
      detalle: 'En toda la carta',
    },
    {
      nombre: 'Matisses',
      logo: 'assets/img/convenio-matisses.png',
      descuento: '30%',
      detalle: 'En alojamiento y pasadía',
    },
    {
      nombre: 'Ziba',
      logo: 'assets/img/convenio-ziba.png',
      descuento: '20%',
      detalle: 'En accesorios seleccionados',
    },
  ];
 
  // ---------- Testimonios ----------
  testimonios = [
    {
      nombre: 'Eliana',
      frase: 'Este beneficio me ayudó a cumplir mi meta',
      imagen: 'assets/img/testimonio-eliana.jpg',
    },
    {
      nombre: 'Edwin',
      frase: 'Gracias a los convenios pude ayudar a mi perrito',
      imagen: 'assets/img/testimonio-edwin.jpg',
    },
    {
      nombre: 'Ana María',
      frase: 'Este convenio fue lo que esperaba',
      imagen: 'assets/img/testimonio-ana.jpg',
    },
  ];
 
  // ---------- Banner de puntuación ----------
  mensajeActual = 0;
  mensajes = [
    {
      titulo: 'Nuestros colaboradores califican nuestra',
      texto: 'organización como "Un gran lugar para trabajar"',
      resaltado: 'con una puntuación de 99,39%',
    },
  ];

  constructor(
    private router: Router,
    private modalController: ModalController,
    private service:PortalService,
    private secureStorage: SecureStorageService,
  ) {}

  ngOnInit(): void {
    this.iniciarCarrusel();
  }
 
  ngOnDestroy(): void {
    this.detenerCarrusel();
  }
 
  // ---------- Lógica del slider ----------
  iniciarCarrusel(): void {
    this.detenerCarrusel();
    this.intervalo = setInterval(() => this.siguiente(), 5000);
  }
 
  detenerCarrusel(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }
 
  siguiente(): void {
    this.indiceActual = (this.indiceActual + 1) % this.beneficios.length;
  }
 
  anterior(): void {
    this.indiceActual =
      (this.indiceActual - 1 + this.beneficios.length) % this.beneficios.length;
  }
 
  seleccionarSlide(i: number): void {
    this.indiceActual = i;
    this.iniciarCarrusel();
  }
 
  // ---------- Scroller horizontal (plan y convenios) ----------
  desplazar(el: HTMLElement, direccion: 1 | -1): void {
    el.scrollBy({ left: direccion * el.clientWidth * 0.8, behavior: 'smooth' });
  }
 
  // ---------- Banner de puntuación ----------
  cambiarMensaje(dir: 1 | -1): void {
    const n = this.mensajes.length;
    this.mensajeActual = (this.mensajeActual + dir + n) % n;
  }
 
  // ---------- Acciones (conecta con tu lógica) ----------
  verBeneficio(b: any): void {}
  abrirPlan(p: any): void {}
  abrirPrograma(p: any): void {}
  abrirConvenio(c: any): void {}
  abrirTestimonio(t: any): void {}
  buscar(): void {}
  abrirAyuda(): void {}
  abrirWhatsapp(): void {
    window.open('https://wa.me/57320150866', '_blank');
  }

}
