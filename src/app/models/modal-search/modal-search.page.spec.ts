import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalSearchPage } from './modal-search.page';

describe('ModalSearchPage', () => {
  let component: ModalSearchPage;
  let fixture: ComponentFixture<ModalSearchPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
