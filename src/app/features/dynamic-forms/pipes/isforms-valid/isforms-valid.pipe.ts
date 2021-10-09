import { Pipe, PipeTransform } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Pipe({
  name: 'isformsValid'
})
export class IsformsValidPipe implements PipeTransform {

  transform(field: FormlyFieldConfig): boolean {
    debugger
    if (!field.fieldGroup) {
      return this.isFormVaild(field);
    }

    var a = field.fieldGroup.every(f => this.isFormVaild(f));


    return field.fieldGroup.every(f => this.isFormVaild(f));
  }

  isFormVaild(field: FormlyFieldConfig) {
    return !field.formControl?.errors;
  }

}


