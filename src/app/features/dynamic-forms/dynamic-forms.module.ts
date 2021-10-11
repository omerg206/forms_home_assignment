import { PanelWrapperComponent } from './dynamic-forms/form-wrappers/panel-wrapper.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormsComponent } from './dynamic-forms/dynamic-forms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { HttpClientModule } from '@angular/common/http';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { IsformsValidPipe } from './pipes/isforms-valid/isforms-valid.pipe';
import { FormlyFieldStepper } from './dynamic-forms/form-wrappers/stepper/stepper-wrapper.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { FormsParseAndCreateServices, requiredMessage } from './dynamic-forms/services/forms-parse-and-create.service';
import { FormsServerCommunicationService } from './dynamic-forms/services/forms-server-communication.service';




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
    MatButtonModule,
    MatCardModule,
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
  providers: [FormsServerCommunicationService, FormsParseAndCreateServices]
})
export class DynamicFormsModule { }
