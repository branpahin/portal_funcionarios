import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelSolicitudesPage } from './panel-solicitudes.page';

describe('PanelSolicitudesPage', () => {
  let component: PanelSolicitudesPage;
  let fixture: ComponentFixture<PanelSolicitudesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelSolicitudesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
