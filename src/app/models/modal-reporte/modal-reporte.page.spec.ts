import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalReportePage } from './modal-reporte.page';

describe('ModalReportePage', () => {
  let component: ModalReportePage;
  let fixture: ComponentFixture<ModalReportePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReportePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
