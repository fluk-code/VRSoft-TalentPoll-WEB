import { Directive, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appFocusBack]',
  standalone: true,
})
export class FocusBackDirective implements OnInit, OnDestroy {
  private _lastFocusedElement!: Element;

  public ngOnInit(): void {
    this._lastFocusedElement = document.activeElement as Element;
  }

  ngOnDestroy(): void {
    this._lastFocusedElement && (this._lastFocusedElement as HTMLElement).focus();
  }
}
