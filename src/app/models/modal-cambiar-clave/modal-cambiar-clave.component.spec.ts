import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalCambiarClaveComponent } from './modal-cambiar-clave.component';

describe('ModalCambiarClaveComponent', () => {
  let component: ModalCambiarClaveComponent;
  let fixture: ComponentFixture<ModalCambiarClaveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCambiarClaveComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCambiarClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
