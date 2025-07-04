import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreacionUsuarioPage } from './creacion-usuario.page';

describe('CreacionUsuarioPage', () => {
  let component: CreacionUsuarioPage;
  let fixture: ComponentFixture<CreacionUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreacionUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
