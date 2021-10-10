import { PanelWrapperComponent } from './dynamic-forms/form-wrappers/panel-wrapper.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormsComponent } from './dynamic-forms/dynamic-forms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { DynamicFormsService } from './dynamic-forms/services/dynamic-forms.service';
import { HttpClientModule } from '@angular/common/http';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { IsformsValidPipe } from './pipes/isforms-valid/isforms-valid.pipe';
import { FormlyFieldStepper } from './dynamic-forms/form-wrappers/stepper/stepper-wrapper.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


export function requiredMessage(err: any, field: FormlyFieldConfig) {
  return `${field.key} is required`;
}


@NgModule({
  declarations: [
    DynamicFormsComponent,
    FormlyFieldStepper,
    IsformsValidPipe,
  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    FormlyMatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    FormlyModule.forRoot({
      validationMessages: [{ name: 'required', message: requiredMessage }],
      types: [
        { name: 'stepper', component: FormlyFieldStepper, wrappers: [] },
      ],
      wrappers: [
        { name: 'panel', component: PanelWrapperComponent },
      ], extras: { lazyRender: true }
    }),
    FormlyMaterialModule,
    HttpClientModule
  ],
  exports: [DynamicFormsComponent],
  providers: [DynamicFormsService]
})
export class DynamicFormsModule { }
