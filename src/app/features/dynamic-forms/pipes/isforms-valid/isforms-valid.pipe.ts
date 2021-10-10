import { Pipe, PipeTransform } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Pipe({
  name: 'isformsValid'
})
export class IsformsValidPipe implements PipeTransform {

  transform(formGroupStatus: 'VALID' | 'INVALID'): boolean {
   return formGroupStatus === 'VALID'
  }



}


