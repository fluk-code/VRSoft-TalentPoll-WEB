import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'fk-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private _currentDate: Date;

  constructor() {
    this._currentDate = new Date();
  }

  public get currentDate(): Date {
    return this._currentDate;
  }
}
