import { Injectable } from "@angular/core";
import { map, Subject } from "rxjs";
import { filter } from 'rxjs/operators';
import { EventData } from "./event.class";

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subject$ = new Subject<EventData>()

  emit(event: EventData) {
    this.subject$.next(event)
  }

  on(eventName: string, action: (args: unknown) => void) {
    return this.subject$.pipe(
      filter((e: EventData) => e.name === eventName),
      map((e: EventData) => e["value"])).subscribe(action);
  }
}