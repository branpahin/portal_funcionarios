import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-error-mensaje',
  standalone: true,
  imports: [CommonModule],  // Importa CommonModule para *ngIf
  template: `
    <div *ngIf="control?.invalid && control?.touched" class="error-message">
      <span *ngIf="control.hasError('required')">⚠️ Este campo es obligatorio.</span>
      <span *ngIf="control.hasError('maxlength')">⚠️ No puede tener más de {{ control.errors?.['maxlength'].requiredLength }} caracteres.</span>
      <span *ngIf="control.hasError('minlength')">⚠️ Debe tener al menos {{ control.errors?.['minlength'].requiredLength }} caracteres.</span>
    </div>
  `,
  styles: [`
    .error-message {
      color: red;
      font-size: 12px;
      margin-top: 4px;
    }
  `]
})
export class ErrorMensajeComponent {
  private _control: AbstractControl = new FormControl(); // Control por defecto

  @Input() set control(value: AbstractControl | null | undefined) {
    this._control = value || new FormControl(); // Si es null o undefined, asigna un control vacío
  }

  get control(): AbstractControl {
    return this._control;
  }
}
