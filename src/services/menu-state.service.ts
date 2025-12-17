import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {
  private menuItemsSubject = new BehaviorSubject<any[]>([]);
  menuItems$ = this.menuItemsSubject.asObservable();

  setMenu(items: any[]) {
    this.menuItemsSubject.next(items);
  }

  getMenuSnapshot() {
    return this.menuItemsSubject.getValue();
  }
}