import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalCrearFuncionarioPage } from './modal-crear-funcionario.page';

describe('ModalCrearFuncionarioPage', () => {
  let component: ModalCrearFuncionarioPage;
  let fixture: ComponentFixture<ModalCrearFuncionarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCrearFuncionarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
