import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class IsRefreshingService {
  private _isRefreshing = signal(false)

  isRefreshing = this._isRefreshing.asReadonly()

  update(newValue: boolean) {
    this._isRefreshing.set(newValue)
  }
}