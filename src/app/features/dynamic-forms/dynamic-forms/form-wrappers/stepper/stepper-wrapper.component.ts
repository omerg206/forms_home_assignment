import { FormsStoreService } from './../../services/forms-store';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { debounce, debounceTime, takeUntil } from 'rxjs/operators';
import { FormSubmissionState } from '../../types/dynamic-forms.types';
import { Subject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'formly-field-stepper',
  templateUrl: './stepper-wrapper.component.html',
  styleUrls: ['./stepper-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class FormlyFieldStepper extends FieldType implements OnInit, OnDestroy {
   formSubmitState!: FormSubmissionState;
   isLoadingFormData$!: Observable<boolean>;
   private onDestroy$: Subject<void> = new Subject();



  constructor(public formsStoreService: FormsStoreService,  private cd: ChangeDetectorRef) {
    super()
  }


  ngOnInit(): void {
    this.isLoadingFormData$ = this.formsStoreService.isGettingFormDataServerChanges().pipe(debounceTime(500));

    this.formsStoreService.formSubmittedChanges().pipe(takeUntil(this.onDestroy$)).subscribe((state: FormSubmissionState) => {
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
