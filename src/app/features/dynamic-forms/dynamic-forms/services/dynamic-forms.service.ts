import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConvertServerFiledTypeToFormType, FormsTypeSchema, FormPropertiesFromServer, SchemasList, SelectionOption, ServerFormDetailsResponse, ServerFromDetailsSchemaPropValue, SubmitDataToServer } from '../types/dynamic-forms.types';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable()
export class DynamicFormsService {
  ///links should be in config/env file
  private serverBaseUrl = 'https://clarityapi.intelligo.ai/api/v1/schemas'
  private formsTypesUrl = '/list';
  private formsSubmitUrl = '/submit';
  constructor(private http: HttpClient) {

  }


  submitFormToServer(model: any): Observable<any> {
    const { formType, ...fromData } = model;
    const dataToServer: SubmitDataToServer = { type: formType.value, form: fromData };

    return this.http.post<any>(this.serverBaseUrl + this.formsSubmitUrl, dataToServer).pipe(
      first(),
      map((response: any) => {
        debugger
        return 4
      }))

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
      else if (this.isStringifyFieldDetails(scheme[property])) {
        const formDetails: FormlyFieldConfig = this.createFormlyFieldConfigFormServerSchema(property, scheme[property] as string);
        parsedDetails.push(formDetails);
      }
      else {
        throw Error(`a non supported field type was received for the server: type ${typeof scheme[property]} property ${property}`)
      }

    }
    return parsedDetails;
  }

  // there is probably a better way for this check (instanceOf or another typescript way)
  private isNestedFormDetails(propValue: string | Object) {
    return typeof propValue === 'object';
  }


  private isStringifyFieldDetails(propValue: string | Object) {
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
    const parsedFiledDetails: FormPropertiesFromServer = JSON.parse(propValue as string);
    let res: FormlyFieldConfig = {};
    const type = ConvertServerFiledTypeToFormType[parsedFiledDetails.type];

    if (!type) {
      throw Error(`non supported form filed type: supportedTypes ${JSON.stringify(ConvertServerFiledTypeToFormType)} property type ${parsedFiledDetails.type}`)
    }

    res = {
      key: propName,
      type,
      templateOptions: {
        label: propName.replace('_', ''),
        options: this.convertServerEnumValuesToSelectionOptions((parsedFiledDetails as any).enumValues),
        readonly: true,
        // placeholder: 'Placeholder',
        description: 'asd',
        indeterminate: false, // angular martial  checkbox  defaults as indeterminate
        required: !!parsedFiledDetails.require,
        value: parsedFiledDetails.value
      }
    }

    return res;
  }



  private convertServerEnumValuesToSelectionOptions(enumValues: string[] | undefined): SelectionOption[] {
    return enumValues ? enumValues.map((value: string) => ({ value, label: value })) : [];
  }

}

