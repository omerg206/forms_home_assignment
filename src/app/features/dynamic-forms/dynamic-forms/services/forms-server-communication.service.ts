import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormsTypeSchema, SchemasList, SelectionOption, ServerFormDetailsResponse, ServerFromDetailsSchemaPropValue, SubmitDataToServer, AllInputFieldDefaultOptions, DefaultFormFiledOptions, ParseSchemaFormServerParams } from '../types/dynamic-forms.types';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormsParseAndCreateServices } from './forms-parse-and-create.service';

@Injectable()
export class FormsServerCommunicationService {
  ///links should be in config/env file and read using config service?
  private serverBaseUrl = 'https://clarityapi.intelligo.ai/api/v1/schemas'
  private formsTypesUrl = '/list';
  private formsSubmitUrl = '/submit';




  constructor(private http: HttpClient, private formsParseAndCreateServices: FormsParseAndCreateServices) {

  }


  submitFormToServer(model: any, formType2: string): Observable<any> {
    const { formType, ...fromData } = model;
    const dataToServer: SubmitDataToServer = { type: formType2, form: fromData }

    return this.http.post<any>(this.serverBaseUrl + this.formsSubmitUrl, dataToServer).pipe(
      first(),
    )

  }



  getFormsTypesFromServer(): Observable<SelectionOption[]> {
    return this.http.get<FormsTypeSchema>(this.serverBaseUrl + this.formsTypesUrl).pipe(
      first(),
      map((response: FormsTypeSchema) => {
        if (!response.succeeded) {
          throw Error(`failed to get form types`)
        }

        return response.result.schemasList.map((fromType: SchemasList) => this.formsParseAndCreateServices.createSelectionObject(fromType.type, fromType.display))
      }))

  }


  getFormDetails(formType: string): Observable<FormlyFieldConfig[]> {
    return this.http.get<ServerFormDetailsResponse>(this.serverBaseUrl + `/${formType}`).pipe(first(),
      map((response: ServerFormDetailsResponse) => {
        const params = { scheme: response.result.scheme as ServerFromDetailsSchemaPropValue, groupName: formType, currentParsedDetails: [], parsedDetails: [] };
        return this.formsParseAndCreateServices.parseFromDetailsResFormServer(params)
      }))
  }



  createFormTypesFiled(propName: string, onFormTypeChangeCb: any): FormlyFieldConfig {
    const fieldOptions: DefaultFormFiledOptions = {
      type: 'select', templateOptions: {
        required: true,
        readonly: true, valueProp: (option: any) => option.value,
        change: onFormTypeChangeCb, label: 'Forms types',
        options: this.getFormsTypesFromServer()
      }
    }

    return this.formsParseAndCreateServices.createFormFiled(propName, fieldOptions);
  }



}

