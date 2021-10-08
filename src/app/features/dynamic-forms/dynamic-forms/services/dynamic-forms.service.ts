import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConvertServerFiledTypeToFormType, FormDetails, FormEnum, FormsTypeSchema, FormType, SchemasList, SelectionOption, ServerFormDetailsResponse, ServerFromDetailsSchemaPropValue } from '../types/dynamic-forms.types';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable()
export class DynamicFormsService {
  ///links sould be in config/env file
  serverBaseUrl = 'https://clarityapi.intelligo.ai/api/v1/schemas'
  formsTypesUrl = '/list';
  constructor(private http: HttpClient) {

  }

  getFormsTypesFromServer(): Observable<SelectionOption[]> {
    return this.http.get<FormsTypeSchema>(this.serverBaseUrl + this.formsTypesUrl).pipe(
      first(),
      map((response: FormsTypeSchema) => {
        return response.result.schemasList.map((fromType: SchemasList) => ({ value: fromType.display, label: fromType.display }))
      }))

  }


  getFormDetails(formType: string): Observable<FormlyFieldConfig[]> {
    return this.http.get<ServerFormDetailsResponse>(this.serverBaseUrl + `/${formType}`).pipe(first(),
      map((response: ServerFormDetailsResponse) => {
        return this.parseFromDetailsResFormServer(response.result.scheme);
      }))
  }


  /**
   * maybe the recursive function should be promised based in case the object is deeply nested
   */
  private parseFromDetailsResFormServer(scheme: ServerFromDetailsSchemaPropValue, parsedDetails: FormlyFieldConfig[] = []): FormlyFieldConfig[] {
    for (const property in scheme) {
      if (this.isNestedFormDetails(scheme[property])) {
        const nestedFiled: FormlyFieldConfig = this.createNestedFormFields(property);
        parsedDetails.push(nestedFiled)
        this.parseFromDetailsResFormServer(scheme[property] as ServerFromDetailsSchemaPropValue, nestedFiled.fieldGroup)
      }
      else if (this.isStringifyRepresentationOfFieldDetails(scheme[property])) {
        const formDetails: FormlyFieldConfig = this.createFormlyFieldConfigFormServerSchema(property, scheme[property] as string);
        parsedDetails.push(formDetails);
      }

      else {
        throw Error(`a non supported field type was received for the server: type ${typeof scheme[property]} property ${property}`)
      }

    }
    return parsedDetails;
  }


  private isNestedFormDetails(propValue: string | Object) {
    return typeof propValue === 'object';
  }

  private isStringifyRepresentationOfFieldDetails(propValue: string | Object) {
    return typeof propValue === 'string';
  }


  private createNestedFormFields(propName: string): FormlyFieldConfig {
    return {
      key: propName,
      wrappers: ['panel'],
      templateOptions: { label: propName },
      fieldGroup: [],
    }
  }


  private createFormlyFieldConfigFormServerSchema(propName: string, propValue: string): FormlyFieldConfig {
    const parsedFiledDetails: FormEnum | FormType = JSON.parse(propValue as any);
    let res = {};
    const type = ConvertServerFiledTypeToFormType[parsedFiledDetails.type];

    if (!type) {
      throw Error(`non supported form filed type: supportedTypes ${JSON.stringify(ConvertServerFiledTypeToFormType)} property type ${parsedFiledDetails.type}`)
    }

    res = {
      key: propName,
      type,
      templateOptions: {
        label: propName,
        options: this.convertServerEnumValuesToSelectionOptions((parsedFiledDetails as any).enumValues),
        // placeholder: 'Placeholder',
        description: propName,
        required: !!(parsedFiledDetails as FormType).require,
      }
    }

    return res;
  }

  private convertServerEnumValuesToSelectionOptions(enumValues: string[] | undefined): SelectionOption[] | null {
    return enumValues ? enumValues.map((value: string) => ({ value, label: value })) : null;
  }

}

