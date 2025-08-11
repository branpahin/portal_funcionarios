import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalCrearFiltroPage } from './modal-crear-filtro.page';

describe('CreacionUsuarioPage', () => {
  let component: ModalCrearFiltroPage;
  let fixture: ComponentFixture<ModalCrearFiltroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCrearFiltroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
