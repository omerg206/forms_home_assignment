import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { FormSubmissionState, GetDateFromServerState } from "../types/dynamic-forms.types";


@Injectable()
export class FormsStoreService {
   private _formSubmission: BehaviorSubject<FormSubmissionState> = new BehaviorSubject<FormSubmissionState>({isSubmittingInProgress: false, isSubmitSuccess: false, isSubmitFail: false});
  private _gettingFormDataServer: BehaviorSubject<GetDateFromServerState> = new BehaviorSubject<GetDateFromServerState>({errorMessage: null, isDataFetchingInProgress: false});

  setFormSubmitted(param: Partial<FormSubmissionState>){
    this._formSubmission.next({...this._formSubmission.value, ...param});
  }

  formSubmittedChanges(): Observable<FormSubmissionState>{
    return this._formSubmission.asObservable();
  }

  setGettingFormDataServer(param: Partial<GetDateFromServerState>){
    this._gettingFormDataServer.next({...this._gettingFormDataServer.value, ...param});
  }
  gettingFormDataServerChanges(): Observable<GetDateFromServerState>{

    return this._gettingFormDataServer.asObservable();
  }




}
