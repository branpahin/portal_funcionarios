import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuscadorSelectWrapperComponent } from './buscador-select-wrapper.component';

describe('BuscadorSelectWrapperComponent', () => {
  let component: BuscadorSelectWrapperComponent;
  let fixture: ComponentFixture<BuscadorSelectWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorSelectWrapperComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorSelectWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
