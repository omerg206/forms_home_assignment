import { Injectable } from "@angular/core";
import { FormlyFieldConfig, FormlyTemplateOptions } from "@ngx-formly/core";
import { DefaultFormFiledOptions, ParseSchemaFormServerParams, ServerFromDetailsSchemaPropValue, FormPropertiesFromServer, SelectionOption, AllInputFieldDefaultOptions } from '../types/dynamic-forms.types';
import { Observable } from 'rxjs';
import { FormlyAttributeEvent } from "@ngx-formly/core/lib/components/formly.field.config";

export function requiredMessage(err: any, field: FormlyFieldConfig) {
  return `${field.key} is required`;
}



@Injectable()
export class FormsParseAndCreateServices {

  /**
   * server options will take precedence over default from field options
   */
    createFormFiled(propName: string, defaultsFiledOptions: DefaultFormFiledOptions): FormlyFieldConfig {
    const normalizePropName = this.normalizeStrings(propName);
    return {
      key: propName,
      type: defaultsFiledOptions.type,
      templateOptions: {
        label: normalizePropName,
        // description: normalizePropName,
        indeterminate: false,    // angular martial  checkbox  defaults as indeterminate
        ...defaultsFiledOptions.templateOptions,
      }
    }
  }


  /**
   * maybe the recursive function should be promised based in case the object is deeply nested.
   *  maybe the function should be irritative
   */
   parseFromDetailsResFormServer({ scheme, parsedDetails = [], currentParsedDetails = [], groupName }: ParseSchemaFormServerParams): FormlyFieldConfig[] {
    //create root and set current parsed details
    if (parsedDetails.length === 0) {
      parsedDetails.push({key:groupName, fieldGroup: [], templateOptions: { label: this.normalizeStrings(groupName) } });
      currentParsedDetails = parsedDetails[0].fieldGroup!;
    }

    for (const property in scheme) {
      if ( this.isNestedFormDetails(scheme[property] )) {
        const nestedScheme = scheme[property] as ServerFromDetailsSchemaPropValue;
        parsedDetails.push({key:property, fieldGroup: [], templateOptions: { label: this.normalizeStrings(property) } });

        this.parseFromDetailsResFormServer({ parsedDetails, currentParsedDetails: parsedDetails[parsedDetails.length - 1].fieldGroup!, groupName: property, scheme: nestedScheme })
      }

      else if (this.isStringifyFieldDetails(scheme[property])) {
        const formDetails: FormlyFieldConfig = this.createFormlyFieldConfigFormServerSchema(property, scheme[property] as string);

        this.addToCurrentFiledGroup(formDetails, groupName, currentParsedDetails);
      }
      else {
        throw Error(`a non supported field type was received for the server: type ${typeof scheme[property]} property ${property}`)
      }

    }
    return parsedDetails;
  }

  createSelectionObject(value: string, display: string = value): SelectionOption {
    const normalizedDisplay = this.normalizeStrings(display)
    return { value, label: normalizedDisplay }
  }


  createFormTypesFiledStartUp(propName: string,onFormTypeChangeCb: FormlyAttributeEvent, formsTypesFromServer: any[] | Observable<any[]>  ): FormlyFieldConfig {
    const fieldOptions: DefaultFormFiledOptions = {
      type: 'select',
      templateOptions: {
        required: true,
        readonly: true,
        valueProp: (option: any) => option.value,
        change: onFormTypeChangeCb,
        label: 'Forms types',
        options: formsTypesFromServer,
      },
    };

    return this.createFormFiled(
      propName,
      fieldOptions
    );
  }

  private defaultFormsFieldsOptions: AllInputFieldDefaultOptions = {
    String: { type: 'input', templateOptions: {} },
    Date: { type: 'datepicker', templateOptions: {  label: 'MM/DD/YY' } },
    Enum: { type: 'select', templateOptions: {} },
    Boolean: { type: 'checkbox', templateOptions: {} },
  }

  private addToCurrentFiledGroup(newFiled: FormlyFieldConfig, groupName: string, currentParsedDetails: FormlyFieldConfig[]) {
    if (!currentParsedDetails[0]) {
      currentParsedDetails[0] = { fieldGroup: [], templateOptions: { label: this.normalizeStrings(groupName) } };
    }

    currentParsedDetails[0]!.fieldGroup!.push(newFiled);
  }



  // there is probably a better way for this check (instanceOf or another typescript way)
  private isNestedFormDetails(propValue: string | Object) {
    return typeof propValue === 'object';
  }


  private isStringifyFieldDetails(propValue: string | Object) {
    return typeof propValue === 'string';
  }


  private createFormlyFieldConfigFormServerSchema(propName: string, propValue: string): FormlyFieldConfig {
    const parsedFiledDetails: FormPropertiesFromServer = JSON.parse(propValue as string);

    if (!this.defaultFormsFieldsOptions[parsedFiledDetails.type]) {
      throw Error(`non supported form filed type ${parsedFiledDetails.type}`)
    }

    const defaultOption: DefaultFormFiledOptions = {
      type: this.defaultFormsFieldsOptions[parsedFiledDetails.type].type,
      templateOptions: {
        ...this.defaultFormsFieldsOptions[parsedFiledDetails.type].templateOptions,
        ...this.convertServerFormOptionsToClientFormOptions(parsedFiledDetails)
      }
    }

    return this.createFormFiled(propName, defaultOption);
  }


  private convertServerFormOptionsToClientFormOptions(parsedFiledDetails: FormPropertiesFromServer): FormlyTemplateOptions {
    return {
      required: !!parsedFiledDetails.require,
      value: parsedFiledDetails.value,
      options: this.convertServerEnumValuesToSelectionOptions((parsedFiledDetails as any).enumValues)
    }
  }

  private convertServerEnumValuesToSelectionOptions(enumValues: string[] | undefined): SelectionOption[] {
    return enumValues ? enumValues.map((value: string) => this.createSelectionObject(value)) : [];
  }



  /** remove _ , septate words, capitalize only first word
   * this could probably be improved and used with angular pipes or css
  */
  private normalizeStrings(stringToNormalize: string): string {
    let normalizeString: string = stringToNormalize;
    normalizeString = normalizeString.replace('_', ' ');
    const stringSplitByCapitalLetter = normalizeString.match(/[A-Z]*[^A-Z]+/g);
    normalizeString = stringSplitByCapitalLetter ? stringSplitByCapitalLetter.join(" ") : normalizeString

    return normalizeString.toLocaleLowerCase();

  }

}
