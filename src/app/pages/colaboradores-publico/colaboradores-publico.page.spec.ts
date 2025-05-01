import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColaboradoresPublicoPage } from './colaboradores-publico.page';

describe('ColaboradoresPublicoPage', () => {
  let component: ColaboradoresPublicoPage;
  let fixture: ComponentFixture<ColaboradoresPublicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ColaboradoresPublicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
