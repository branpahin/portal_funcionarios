import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualizacionFiltrosPage } from './actualizacion-filtros.page';

describe('ActualizacionFiltrosPage', () => {
  let component: ActualizacionFiltrosPage;
  let fixture: ComponentFixture<ActualizacionFiltrosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizacionFiltrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
