import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComponenteBusquedaComponent } from './componente-busqueda.component';

describe('ComponenteBusquedaComponent', () => {
  let component: ComponenteBusquedaComponent;
  let fixture: ComponentFixture<ComponenteBusquedaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponenteBusquedaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
