import { Component, Input, booleanAttribute } from '@angular/core';

@Component({
  selector: 'fk-btn-small-add',
  standalone: true,
  imports: [],
  templateUrl: './btn-small-add.component.html',
  styleUrl: './btn-small-add.component.scss',
})
export class BtnSmallAddComponent {
  @Input({ transform: booleanAttribute, required: true }) disabled!: boolean;
}
