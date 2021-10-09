import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { DynamicFormsService } from './services/dynamic-forms.service';
import { SubmittedService } from './services/submitted.service';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject();
  private readonly formTypesSelectKey: string = 'formType';

  isSubmitted: boolean = false;
  form: FormGroup = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [{
    type: 'stepper',
    fieldGroup: []
  }]

  currentSelectedFormType: string = 'Main';

  constructor(private dynamicFormsService: DynamicFormsService, public submittedService: SubmittedService, private cd: ChangeDetectorRef) { }


  ngOnInit(): void {
    const formsTypeFiled = this.dynamicFormsService.createFormTypesFiled(this.formTypesSelectKey, this.onFormTypeChange.bind(this))
    this.fields[0].fieldGroup?.push((formsTypeFiled));
  }


  onFormTypeChange(model: any, selectedFromType: any) {
    this.currentSelectedFormType = selectedFromType.value;
    this.model = { [this.formTypesSelectKey]: this.currentSelectedFormType };
    // reset form keep only form type selection;
    this.removeAllNonFormTypeFields();

    this.dynamicFormsService.getFormDetails(this.currentSelectedFormType).pipe(takeUntil(this.onDestroy$)).subscribe((res: FormlyFieldConfig[]) => {
      this.updateFormFields(res);
      this.cd.detectChanges();
    })

  }

  updateFormFields(newFields: FormlyFieldConfig[]) {

    this.fields[0].fieldGroup = this.fields[0].fieldGroup?.concat(newFields);
    debugger
    this.formFiledsRefChangeToTriggerChangeDetectin();
  }

  removeAllNonFormTypeFields() {
    this.fields[0].fieldGroup = [(this.fields[0] as any).fieldGroup[0]];
    this.formFiledsRefChangeToTriggerChangeDetectin();
    this.submittedService.isSubmitted.next(false);
  }

  formFiledsRefChangeToTriggerChangeDetectin() {
    this.fields = [...this.fields];
  }


  submit() {
    this.dynamicFormsService.submitFormToServer(this.model).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.submittedService.isSubmitted.next(true);
      alert('from submitted')
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
