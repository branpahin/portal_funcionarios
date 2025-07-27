import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoUsuariosPage } from './listado-usuarios.page';

describe('ListadoUsuariosPage', () => {
  let component: ListadoUsuariosPage;
  let fixture: ComponentFixture<ListadoUsuariosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
