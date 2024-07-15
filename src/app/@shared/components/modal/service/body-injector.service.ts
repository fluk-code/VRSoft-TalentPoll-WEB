import { ApplicationRef, ComponentRef, EmbeddedViewRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BodyInjectorService {
  constructor(private readonly _appRef: ApplicationRef) {}

  public stackBeforeAppRoot<T>(componentRef: ComponentRef<T>): void {
    const domElement = this.createDomElement<T>(componentRef);
    const appRoot = document.body.querySelector('app-root');

    document.body.insertBefore(domElement, appRoot);
  }

  private createDomElement<T>(componentRef: ComponentRef<T>): HTMLElement {
    this._appRef.attachView(componentRef.hostView);

    return (componentRef.hostView as EmbeddedViewRef<T>).rootNodes[0] as HTMLElement;
  }
}
