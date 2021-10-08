import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormDetails, FormsTypeSchema, SchemasList, SelectionOption, ServerFormDetailsResponse, ServerFromDetailsSchemaPropValue } from './types/dynamic-forms.types';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class DynamicFormsService {
  serverBaseUrl = 'https://clarityapi.intelligo.ai/api/v1/schemas'
  formsTypesUrl = '/list';
  constructor(private http: HttpClient) {

  }

  getFormsTypesFromServer(): Observable<SelectionOption[]> {
    return this.http.get<FormsTypeSchema>(this.serverBaseUrl + this.formsTypesUrl).pipe(
      map((response: FormsTypeSchema) => {
        return response.result.schemasList.map((fromType: SchemasList) => ({ value: fromType.display, label: fromType.display }))
      }))

  }

  /**
   *
   * @param formType
   * @returns
   */
  getFormDetails(formType: string) {
    return this.http.get<ServerFormDetailsResponse>(this.serverBaseUrl + `/${formType}`).pipe(
      map((response: ServerFormDetailsResponse) => {
        return this.parseFromDetailsResFormServer(response.result.scheme);
      }))
  }


  /**
   * maybe the recursive function should be promised based in case the object is deeply nested
   */
  private parseFromDetailsResFormServer(scheme: ServerFromDetailsSchemaPropValue, parsedDetails: FormDetails = {}): FormDetails {
    for (const property in scheme) {
      if (typeof scheme[property] === 'object') {
        parsedDetails[property] = {};
        this.parseFromDetailsResFormServer(scheme[property] as ServerFromDetailsSchemaPropValue)
      }
      else if (typeof scheme[property] === 'string') {
        parsedDetails[property] = JSON.parse(scheme[property] as any)
      }

      else {
        throw Error(`a non supported field type was received for the server: type ${typeof scheme[property]} property ${property}`)
      }

    }
    return parsedDetails;
  }

}


