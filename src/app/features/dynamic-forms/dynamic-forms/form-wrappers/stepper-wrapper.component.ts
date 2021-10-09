import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { SubmittedService } from '../services/submitted.service';

@Component({
  selector: 'formly-field-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <mat-stepper orientation="vertical">
    <mat-step
      *ngFor="let step of field.fieldGroup; let index = index; let last = last;">
      <ng-template matStepLabel >{{ step.templateOptions?.label }}</ng-template>
      <formly-field [field]="step"></formly-field>

      <div>
        <button matStepperPrevious *ngIf="index !== 0"
          class="btn btn-primary"
          type="button">
          Back
        </button>

        <button matStepperNext *ngIf="!last"
          class="btn btn-primary" type="button"

          >
          Next
        </button>

        <button *ngIf="last && index > 0" class="btn btn-primary"
          [disabled]="!form.valid"
          type="submit">
          Submit {{this.submittedService.isSubmitted | async }}
        </button>
      </div>
    </mat-step>
  </mat-stepper>
`,
})
export class FormlyFieldStepper extends FieldType {
  // isSubmitted = this.submittedService.isSubmitted;

  constructor(public submittedService: SubmittedService) {
    super()
  }

  isValid(field: FormlyFieldConfig,): boolean {

    if (!field.fieldGroup) {
      return !field.formControl?.errors;
    }


    return field.fieldGroup.every(f => this.isValid(f));
  }
}
