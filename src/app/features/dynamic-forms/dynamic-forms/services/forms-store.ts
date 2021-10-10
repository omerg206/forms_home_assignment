import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { FormSubmissionState } from "../types/dynamic-forms.types";


@Injectable({ providedIn: 'root' })
export class FormsStoreService {
  private _formSubmission: BehaviorSubject<FormSubmissionState> = new BehaviorSubject<FormSubmissionState>({isSubmittingInProgress: false, isSubmitSuccess: false, isSubmitFail: false});
  private _isErrorSubmitted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isGettingFormDataServer: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  setFormSubmitted(param: Partial<FormSubmissionState>){
    this._formSubmission.next({...this._formSubmission.value, ...param});
  }

  formSubmittedChanges(): Observable<FormSubmissionState>{
    return this._formSubmission.asObservable();
  }

  setIsErrorSubmitted(isErrorSubmitted: boolean){
    this._isErrorSubmitted.next(isErrorSubmitted);
  }

  isErrorSubmittedChanges(): Observable<boolean>{
    return this._isErrorSubmitted.asObservable();
  }

  setIsGettingFormDataServer(isGettingFormDataServer: boolean){
    this._isGettingFormDataServer.next(isGettingFormDataServer);
  }

  isGettingFormDataServerChanges(): Observable<boolean>{
    return this._isGettingFormDataServer.asObservable();
  }


}
