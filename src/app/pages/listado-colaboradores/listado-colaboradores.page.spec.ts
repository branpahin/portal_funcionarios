import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoColaboradoresPage } from './listado-colaboradores.page';

describe('ListadoColaboradoresPage', () => {
  let component: ListadoColaboradoresPage;
  let fixture: ComponentFixture<ListadoColaboradoresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoColaboradoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
