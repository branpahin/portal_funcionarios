import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalVistaPreviaPage } from './modal-vista-previa.page';

describe('ModalVistaPreviaPage', () => {
  let component: ModalVistaPreviaPage;
  let fixture: ComponentFixture<ModalVistaPreviaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalVistaPreviaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
