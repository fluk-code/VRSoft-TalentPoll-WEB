import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
} from '@angular/core';

import { ModalConfig } from '../interface/modal.interface';
import { ModalRef } from '../modal-ref';
import { ModalComponent } from '../modal.component';
import { BodyInjectorService } from './body-injector.service';

@Injectable()
export class ModalService {
  private _modalComponentFactory!: ComponentFactory<ModalComponent>;

  constructor(
    private readonly injector: Injector,
    private readonly bodyInjectorService: BodyInjectorService,
    componentFactoryResolver: ComponentFactoryResolver
  ) {
    this._modalComponentFactory = componentFactoryResolver.resolveComponentFactory(ModalComponent);
  }

  public open<T>(config: ModalConfig<T>): ModalRef {
    console.log('open called');

    const componentRef = this.createComponentRef();
    componentRef.instance.config = config;

    this.bodyInjectorService.stackBeforeAppRoot(componentRef);
    const modalRef = new ModalRef(componentRef);
    componentRef.instance.modalRef = modalRef;

    return modalRef;
  }

  private createComponentRef(): ComponentRef<ModalComponent> {
    return this._modalComponentFactory.create(this.injector);
  }
}
