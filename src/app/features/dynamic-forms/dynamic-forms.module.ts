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
import { FormlyFieldStepper } from './dynamic-forms/form-wrappers/stepper-wrapper.component';
export function requiredMessage(err: any, field: FormlyFieldConfig) {
  return `${field.key} is required`;
}


@NgModule({
  declarations: [
    DynamicFormsComponent,
    FormlyFieldStepper,
  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    FormlyMatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
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
