import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalCrearSolicitudPage } from './modal-crear-solicitud.page';

describe('ModalCrearSolicitudPage', () => {
  let component: ModalCrearSolicitudPage;
  let fixture: ComponentFixture<ModalCrearSolicitudPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCrearSolicitudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
