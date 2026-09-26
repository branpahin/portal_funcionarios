import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiligenciarSolicitudPage } from './diligenciar-solicitud.page';

describe('DiligenciarSolicitudPage', () => {
  let component: DiligenciarSolicitudPage;
  let fixture: ComponentFixture<DiligenciarSolicitudPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiligenciarSolicitudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
