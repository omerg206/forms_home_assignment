import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FormsTypeSchema,
  SchemasList,
  SelectionOption,
  ServerFormDetailsResponse,
  ServerFromDetailsSchemaPropValue,
  SubmitDataToServer,
  DefaultFormFiledOptions,
} from '../types/dynamic-forms.types';
import { catchError, first, map, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormsParseAndCreateServices } from './forms-parse-and-create.service';
import { of } from 'rxjs';
import { FormsStoreService } from './forms-store.service';
import { Subject } from 'rxjs';
import { FormlyAttributeEvent } from '@ngx-formly/core/lib/components/formly.field.config';

@Injectable()
export class FormsServerCommunicationService {
  ///links should be in config/env file and read using config service?
  private serverBaseUrl = 'https://clarityapi.intelligo.ai/api/v1/schemas';
  private formsTypesUrl = '/list';
  private formsSubmitUrl = '/submit';

  private onDestroy$: Subject<void> = new Subject();

  constructor(
    private http: HttpClient,
    private formsStoreService: FormsStoreService,
    private formsParseAndCreateServices: FormsParseAndCreateServices
  ) {}

  submitFormToServer(model: any, formType2: string): Observable<any> {
    const { formType, ...fromData } = model;
    const dataToServer: SubmitDataToServer = {
      type: formType2,
      form: fromData,
    };

    return this.http
      .post<any>(this.serverBaseUrl + this.formsSubmitUrl, dataToServer)
      .pipe(first(), takeUntil(this.onDestroy$));
  }

  getFormsTypesFromServer(): Observable<SelectionOption[]> {
    this.formsStoreService.setGettingFormDataServer({
      errorMessage: null,
      isDataFetchingInProgress: true,
    });

    return this.http
      .get<FormsTypeSchema>(this.serverBaseUrl + this.formsTypesUrl)
      .pipe(
        first(),
        map((response: FormsTypeSchema) => {
          if (!response.succeeded) {
            throw Error(`failed to get form types`);
          }

          this.formsStoreService.setGettingFormDataServer({
            errorMessage: null,
            isDataFetchingInProgress: false,
          });

          return response.result.schemasList.map((fromType: SchemasList) =>
            this.formsParseAndCreateServices.createSelectionObject(
              fromType.type,
              fromType.display
            )
          );
        }),
        takeUntil(this.onDestroy$),
        catchError((error: any) => {
          this.formsStoreService.setGettingFormDataServer({
            errorMessage: 'error getting forms',
            isDataFetchingInProgress: false,
          });
          console.log('error getting forms types', error);
          return of([]);
        })
      );
  }

  getFormDetails(formType: string): Observable<FormlyFieldConfig[]> {
    return this.http
      .get<ServerFormDetailsResponse>(this.serverBaseUrl + `/${formType}`)
      .pipe(
        first(),
        map((response: ServerFormDetailsResponse) => {
          const params = {
            scheme: response.result.scheme as ServerFromDetailsSchemaPropValue,
            groupName: formType,
            currentParsedDetails: [],
            parsedDetails: [],
          };
          return this.formsParseAndCreateServices.parseFromDetailsResFormServer(
            params
          );
        }),
        takeUntil(this.onDestroy$)
      );
  }

  createFormTypesFiled(propName: string,onFormTypeChangeCb: FormlyAttributeEvent ): FormlyFieldConfig{
   return  this.formsParseAndCreateServices.createFormTypesFiledStartUp( propName, onFormTypeChangeCb, this.getFormsTypesFromServer());
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
