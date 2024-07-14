import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';

import { ModalConfig } from './interface/modal.interface';
import { ModalRef } from './modal-ref';

@Component({
  selector: 'fk-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @HostBinding('@fade') fade = true;

  public config!: ModalConfig<unknown>;
  public modalRef!: ModalRef;
}
