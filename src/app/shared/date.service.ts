import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  getFormattedCurrentDate(): string {
    const now = new Date();
    return `${(now.getMonth()+1)}/${now.getDate()}/${now.getFullYear()}`;
  }
}
