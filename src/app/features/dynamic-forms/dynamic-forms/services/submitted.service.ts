import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({ providedIn: 'root' })
export class SubmittedService {
  isSubmitted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

}
