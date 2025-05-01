import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditarFuncionarioPage } from './modal-editar-funcionario.page';

describe('ModalEditarFuncionarioPage', () => {
  let component: ModalEditarFuncionarioPage;
  let fixture: ComponentFixture<ModalEditarFuncionarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditarFuncionarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
