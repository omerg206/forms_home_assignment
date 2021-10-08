import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormsComponent } from './dynamic-forms/dynamic-forms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { DynamicFormsService } from './dynamic-forms/services/dynamic-forms.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    DynamicFormsComponent,

  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    FormlyModule.forRoot({ extras: { lazyRender: true } }),
    FormlyMaterialModule,
    HttpClientModule
  ],
  exports: [DynamicFormsComponent],
  providers: [DynamicFormsService]
})
export class DynamicFormsModule { }
