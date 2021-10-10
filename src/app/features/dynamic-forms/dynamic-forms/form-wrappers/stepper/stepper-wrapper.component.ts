import { FormsStoreService } from './../../services/forms-store';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { debounce, debounceTime, takeUntil } from 'rxjs/operators';
import { FormSubmissionState, GetDateFromServerState } from '../../types/dynamic-forms.types';
import { Subject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';


export function getFormDetailsValidator(control: FormControl, field: FormlyFieldConfig, options = {}): ValidationErrors {
  return { 'date-future': { message: `Validator options: ${JSON.stringify(options)}` } };
}

@Component({
  selector: 'formly-field-stepper',
  templateUrl: './stepper-wrapper.component.html',
  styleUrls: ['./stepper-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class FormlyFieldStepper extends FieldType implements OnInit, OnDestroy {
   formSubmitState!: FormSubmissionState;
   getDateFromServerState!: GetDateFromServerState;
   private onDestroy$: Subject<void> = new Subject();

   @ViewChild('stepper') stepper!: MatStepper;


  constructor(public formsStoreService: FormsStoreService,  private cd: ChangeDetectorRef) {
    super()
  }


  ngOnInit(): void {


     this.formsStoreService.gettingFormDataServerChanges().pipe(debounceTime(500), (takeUntil(this.onDestroy$)))
     .subscribe((state: GetDateFromServerState) => {
      this.getDateFromServerState = state;
      this.cd.detectChanges()
     })

    this.formsStoreService.formSubmittedChanges().pipe().subscribe((state: FormSubmissionState) => {
      this.formSubmitState = state;
      this.cd.detectChanges()
    })



  }

  isValid(field: FormlyFieldConfig,): boolean {

    if (!field.fieldGroup) {
      return !field.formControl?.errors;
    }


    return field.fieldGroup.every(f => this.isValid(f));
  }

  bla(step: any){
    var a = this.stepper.selectedIndex;
    //@ts-ignore
    var b = this.field!.fieldGroup[a];
       //@ts-ignore
    var c = this.field!.fieldGroup[a].formControl;
    debugger
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
