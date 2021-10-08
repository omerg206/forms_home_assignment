import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { DynamicFormsService } from './services/dynamic-forms.service';
import { SelectionOption } from './types/dynamic-forms.types';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject();
  form: FormGroup = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];
  selectionOptions$: BehaviorSubject<SelectionOption[]> = new BehaviorSubject<SelectionOption[]>([]);
  currentSelectedFormType: string = 'Main';

  constructor(private dynamicFormsService: DynamicFormsService, private cd: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.fields.push(this.addStartupFormTypesPicker());

    this.dynamicFormsService.getFormsTypesFromServer().pipe(
      takeUntil(this.onDestroy$)).subscribe((options: SelectionOption[]) => {
        this.selectionOptions$.next(options);
      })
  }

  //consider moving this function to a service
  addStartupFormTypesPicker(): FormlyFieldConfig {
    return {
      key: 'formType',
      type: 'select',
      focus: true,

      // wrappers: ['panel'],
      templateOptions: {
        label: 'Forms types',
        required: false,
        readonly: true,
        options: this.selectionOptions$,
        valueProp: (option: any) => option,
        // compareWith: (o1: any, o2: any) => o1.value === o2.value,
        change: this.onFormTypeChange.bind(this)

      }
    }
  }


  onFormTypeChange(model: any, { value: selectedFromType }: any) {
    this.currentSelectedFormType = selectedFromType.value;
    // this.fields = [this.fields[0]]; // reset form keep only form type selection;
    this.dynamicFormsService.getFormDetails(selectedFromType.value).pipe(takeUntil(this.onDestroy$)).subscribe((res: FormlyFieldConfig[]) => {
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
