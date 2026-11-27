import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColaboradoresPrivadoPage } from './colaboradores-privado.page';

describe('ColaboradoresPrivadoPage', () => {
  let component: ColaboradoresPrivadoPage;
  let fixture: ComponentFixture<ColaboradoresPrivadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ColaboradoresPrivadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
