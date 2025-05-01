import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalInfoColaboradorPage } from './modal-info-colaborador.page';

describe('ModalInfoColaboradorPage', () => {
  let component: ModalInfoColaboradorPage;
  let fixture: ComponentFixture<ModalInfoColaboradorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInfoColaboradorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
