import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { DynamicFormsService } from './services/dynamic-forms.service';
import { SelectionOption } from './services/types/dynamic-forms.types';

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
  selectionOptions: BehaviorSubject<SelectionOption[]> = new BehaviorSubject<SelectionOption[]>([]);

  fields: FormlyFieldConfig[] = [{
    key: 'FormsTypesSelection',
    type: 'select',
    focus: true,
    templateOptions: {
      label: 'Forms types',
      required: true,
      readonly: true,
      options: this.selectionOptions,
    }
  }]


  constructor(private dynamicFormsService: DynamicFormsService, private cd: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.dynamicFormsService.getFormsTypesFromServer().pipe(
      takeUntil(this.onDestroy$)).subscribe((options: SelectionOption[]) => {
        this.selectionOptions.next(options);
      })
  }




  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
