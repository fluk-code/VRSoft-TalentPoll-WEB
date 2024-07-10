import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ThemeChangerComponent } from './theme-changer/theme-changer.component';

@Component({
  selector: 'fk-navbar',
  standalone: true,
  imports: [CommonModule, ThemeChangerComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {}
