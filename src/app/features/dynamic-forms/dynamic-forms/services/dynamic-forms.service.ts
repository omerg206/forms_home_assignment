import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormsTypeSchema, SchemasList, SelectionOption } from './types/dynamic-forms.types';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class DynamicFormsService {
  formsTypesUrl = 'https://clarityapi.intelligo.ai/api/v1/schemas/list'
  constructor(private http: HttpClient) {

  }

  getFormsTypesFromServer(): Observable<SelectionOption[]> {
    return this.http.get<FormsTypeSchema>(this.formsTypesUrl).pipe(
      map((response: FormsTypeSchema) => {
        return response.result.schemasList.map((fromType: SchemasList) => ({ value: fromType.display, label: fromType.display }))
      }))

  }
}
