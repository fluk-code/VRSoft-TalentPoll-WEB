import { TemplateRef } from '@angular/core';

export interface ModalConfig<T> {
  templateRef: TemplateRef<T>;
  title: string;
}
