import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ThemeChangerComponent } from './theme-changer/theme-changer.component';

@Component({
  selector: 'fk-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeChangerComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {}
