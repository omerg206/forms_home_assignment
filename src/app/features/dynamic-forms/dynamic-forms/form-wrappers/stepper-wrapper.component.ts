import { Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-stepper',
  template: `
  <mat-horizontal-stepper>
    <mat-step
      *ngFor="let step of field.fieldGroup; let index = index; let last = last;">
      <formly-field [field]="step"></formly-field>

      <div>
        <button matStepperPrevious *ngIf="index !== 0"
          class="btn btn-primary"
          type="button">
          Back
        </button>

        <button matStepperNext *ngIf="!last"
          class="btn btn-primary" type="button"
          [disabled]="true">
          Next
        </button>

        <button *ngIf="last" class="btn btn-primary"
          [disabled]="!form.valid"
          type="submit">
          Submit
        </button>
      </div>
    </mat-step>
  </mat-horizontal-stepper>
`,
})
export class FormlyFieldStepper extends FieldType {
  isValid(field: FormlyFieldConfig): boolean {
    if (field.key) {
      return true;
    }

    //@ts-ignore
    return field.fieldGroup.every(f => this.isValid(f));
  }
}
