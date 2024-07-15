import { ComponentRef } from '@angular/core';

import { ModalComponent } from './modal.component';

export class ModalRef {
  constructor(private readonly _componentRef: ComponentRef<ModalComponent>) {}

  public close(): void {
    this._componentRef.destroy();
  }
}
