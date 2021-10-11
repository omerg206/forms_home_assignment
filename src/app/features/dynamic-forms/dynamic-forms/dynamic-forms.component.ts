import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { FormsServerCommunicationService } from './services/forms-server-communication.service';
import { FormsStoreService } from './services/forms-store.service';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject();
  private readonly formTypesSelectKey: string = 'formType';
  private currentFormType: string ='';

  isSubmitted: boolean = false;
  form: FormGroup = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [{
    type: 'stepper',
    fieldGroup: []
  }]

  currentSelectedFormType: string = 'Main';

  constructor(private formsServerCommunicationService: FormsServerCommunicationService, public formsStoreService: FormsStoreService, private cd: ChangeDetectorRef) { }


  ngOnInit(): void {
    const formsTypeFiled = this.formsServerCommunicationService.createFormTypesFiled(this.formTypesSelectKey, this.onFormTypeChange.bind(this));
    this.fields[0].fieldGroup?.push((formsTypeFiled));
  }


  onFormTypeChange(model: any, selectedFromType: any) {

    this.currentSelectedFormType = selectedFromType.value;
    this.model = { [this.formTypesSelectKey]: this.currentSelectedFormType };
    this.currentFormType = selectedFromType;
    // reset form keep only form type selection;
    this.removeAllNonFormTypeFields();

    this.formsServerCommunicationService.getFormDetails(this.currentSelectedFormType).pipe(takeUntil(this.onDestroy$))
      .subscribe((res: FormlyFieldConfig[]) => {
      this.formsStoreService.setGettingFormDataServer({isDataFetchingInProgress: false, errorMessage: null});
      this.updateFormFields(res);
      this.cd.detectChanges();

    }, (error) => {
      console.log(`error getting data for ${this.currentSelectedFormType}`, error);
      this.formsStoreService.setGettingFormDataServer({isDataFetchingInProgress: false, errorMessage:'error getting form type form Server'});
    })

  }

  updateFormFields(newFields: FormlyFieldConfig[]) {

    this.fields[0].fieldGroup = this.fields[0].fieldGroup?.concat(newFields);
    this.formFiledsRefChangeToTriggerChangeDetection();
  }

  removeAllNonFormTypeFields() {
    this.fields[0].fieldGroup = [(this.fields[0] as any).fieldGroup[0]];
    this.form =  new FormGroup({});
    this.formFiledsRefChangeToTriggerChangeDetection();
    this.formsStoreService.setGettingFormDataServer({errorMessage: null, isDataFetchingInProgress: true});
    this.formsStoreService.setFormSubmitted({isSubmitFail: false, isSubmitSuccess: false, isSubmittingInProgress: false});

  }

  formFiledsRefChangeToTriggerChangeDetection() {
    this.fields = [...this.fields];
  }


  submit() {
    this.formsStoreService.setFormSubmitted({isSubmittingInProgress: true, isSubmitFail: false, isSubmitSuccess: false});
    this.formsServerCommunicationService.submitFormToServer(this.model, this.formTypesSelectKey).pipe(takeUntil(this.onDestroy$))
    .subscribe(() => {

      this.formsStoreService.setFormSubmitted({isSubmittingInProgress: false, isSubmitSuccess: true, isSubmitFail: false});

      alert('form submitted')
    },
    (error) => {
      console.log(`error submitting  ${this.currentSelectedFormType}`, error);
      this.formsStoreService.setFormSubmitted({isSubmittingInProgress: false, isSubmitSuccess: false, isSubmitFail: true});
      alert('failed to submit')
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
