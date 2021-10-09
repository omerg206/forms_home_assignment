import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { DynamicFormsService } from './services/dynamic-forms.service';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject();
  private readonly formTypesSelectKey: string = 'formType';
  form: FormGroup = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];
  currentSelectedFormType: string = 'Main';

  constructor(private dynamicFormsService: DynamicFormsService, private cd: ChangeDetectorRef) { }


  ngOnInit(): void {
    const formsTypeFiled = this.dynamicFormsService.createFormTypesFiled(this.formTypesSelectKey, this.onFormTypeChange.bind(this))
    this.fields.push(formsTypeFiled);
  }


  onFormTypeChange(model: any, selectedFromType: any) {
    this.currentSelectedFormType = selectedFromType.value;
    this.model = { [this.formTypesSelectKey]: this.currentSelectedFormType };
    this.fields = [this.fields[0]];   // reset form keep only form type selection;

    this.dynamicFormsService.getFormDetails(this.currentSelectedFormType).pipe(takeUntil(this.onDestroy$)).subscribe((res: FormlyFieldConfig[]) => {
      this.fields = [...this.fields, ...res];
      this.cd.detectChanges();
    })

  }


  submit() {
    this.dynamicFormsService.submitFormToServer(this.model).subscribe(() => {

    })


  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
