import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LocalStorageKeysEnum } from '../../../services/local-storage/enums/local-storage-keys.enum';
import { ThemeOptionsENUM } from './enums/theme-options.enum';

@Component({
  selector: 'fk-theme-changer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './theme-changer.component.html',
})
export class ThemeChangerComponent implements OnInit {
  keyStorageTheme = LocalStorageKeysEnum.THEME;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.preLoadTheme();
  }

  get isLightTheme(): boolean {
    return this.getLocalStorageTheme() !== ThemeOptionsENUM.DARK;
  }

  toggleTheme(): void {
    let theme: ThemeOptionsENUM;

    if (this.isLightTheme) {
      theme = ThemeOptionsENUM.DARK;
    } else {
      theme = ThemeOptionsENUM.LIGHT;
    }

    this.renderTheme(theme);
    this.saveStorageTheme(theme);
  }

  private saveStorageTheme(value: ThemeOptionsENUM) {
    this.hasLocalStorage() && localStorage.setItem(this.keyStorageTheme, value);
  }

  private getLocalStorageTheme(): ThemeOptionsENUM {
    const theme = ThemeOptionsENUM.LIGHT;

    if (this.hasLocalStorage()) {
      const localStorageTheme = localStorage.getItem(this.keyStorageTheme);

      if (Object.values(ThemeOptionsENUM).includes(localStorageTheme as ThemeOptionsENUM)) {
        return localStorageTheme as ThemeOptionsENUM;
      }
    }

    return theme;
  }

  private preLoadTheme() {
    const localStorageTheme = this.getLocalStorageTheme();
    this.renderTheme(localStorageTheme);
  }

  private renderTheme(theme: ThemeOptionsENUM): void {
    this.renderer.setAttribute(this.document.documentElement, 'theme', theme);
  }

  private hasLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }
}
