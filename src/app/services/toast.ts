import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  text: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  readonly toast$ = this.toastSubject.asObservable();
  private nextId = 0;
  private hideTimer?: ReturnType<typeof setTimeout>;

  show(text: string, durationMs = 2800): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }

    this.toastSubject.next({ text, id: ++this.nextId });

    this.hideTimer = setTimeout(() => {
      this.toastSubject.next(null);
      this.hideTimer = undefined;
    }, durationMs);
  }
}
