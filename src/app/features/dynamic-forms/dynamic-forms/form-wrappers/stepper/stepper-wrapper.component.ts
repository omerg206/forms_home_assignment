import { FormsStoreService } from '../../services/forms-store.service';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import {  debounceTime, takeUntil } from 'rxjs/operators';
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
  private onDestroy$: Subject<void> = new Subject();
  formSubmitState!: FormSubmissionState;
  getDateFromServerState!: GetDateFromServerState;
  errorMessage: string | null  = null;

  @ViewChild('stepper') stepper!: MatStepper;


  constructor(public formsStoreService: FormsStoreService, private cd: ChangeDetectorRef) {
    super()
  }


  ngOnInit(): void {



    this.formsStoreService.gettingFormDataServerChanges().pipe(debounceTime(500), (takeUntil(this.onDestroy$)))
      .subscribe((state: GetDateFromServerState) => {
        this.getDateFromServerState = state;
        this.errorMessage = state.errorMessage;
        this.cd.detectChanges()
      })

    this.formsStoreService.formSubmittedChanges().pipe(takeUntil(this.onDestroy$)).subscribe((state: FormSubmissionState) => {
      this.formSubmitState = state;
      this.cd.detectChanges()
    })


    this.form.valueChanges.pipe(debounceTime(50), takeUntil(this.onDestroy$)).subscribe(() => {

    })

  }



  trackByFn(index: number, item: FormlyFieldConfig) {
    return item.key; // or item.id
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
