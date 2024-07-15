import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFocusTrap]',
  standalone: true,
})
export class FocusTrapDirective implements AfterViewInit {
  private _firstFocusableElement!: HTMLElement;
  private _lastFocusableElement!: HTMLElement;

  constructor(private readonly _elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const focusableElement = this._elementRef.nativeElement.querySelectorAll(`
        [tabindex]:not([tabindex="-1"]),
        a[href]:not([disabled]),
        button:not([disabled]),
        textarea:not([disabled]),
        input:not([disabled]),
        select:not([disabled])
      `) as HTMLElement[];

    this._firstFocusableElement = focusableElement[0];
    this._lastFocusableElement = focusableElement[focusableElement.length - 1];

    this._firstFocusableElement.focus();
  }

  @HostListener('keydown', ['$event'])
  public manateTabe(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    if (event.shiftKey && document.activeElement === this._firstFocusableElement) {
      this._lastFocusableElement.focus();
      event.preventDefault();
    } else if (document.activeElement === this._lastFocusableElement) {
      this._firstFocusableElement.focus();
      event.preventDefault();
    }
  }
}
