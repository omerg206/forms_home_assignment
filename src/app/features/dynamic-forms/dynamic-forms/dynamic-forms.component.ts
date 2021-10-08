import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { DynamicFormsService } from './services/dynamic-forms.service';
import { SelectionOption } from '../../../../../.history/src/app/features/dynamic-forms/dynamic-forms/services/types/dynamic-forms.types_20211008104515';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject();
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: BehaviorSubject<FormlyFieldConfig[]> = new BehaviorSubject<FormlyFieldConfig[]>([]);


  constructor(private dynamicFormsService: DynamicFormsService) { }


  ngOnInit(): void {
    this.dynamicFormsService.getFormsTypesFromServer().pipe(


      //         // options: [
      //         //   { value: 1, label: 'Option 1' },
      //         //   { value: 2, label: 'Option 2' },
      //         //   { value: 3, label: 'Option 3' },
      //         //   { value: 4, label: 'Option 4', disabled: true },
      //         // ],
      //       },

      //     }])


      takeUntil(this.onDestroy$)).subscribe((options: SelectionOption[]) => {
        this.fields.next([{
          key: 'FormsTypesSelection',
          type: 'select',
          templateOptions: {
            label: 'Forms types',
            required: true,
            readonly: true,
            options
          }
        }
        ])
      })
  }



  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
