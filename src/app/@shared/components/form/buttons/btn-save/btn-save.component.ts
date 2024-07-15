import { Component, Input, booleanAttribute } from '@angular/core';

@Component({
  selector: 'fk-btn-save',
  standalone: true,
  imports: [],
  templateUrl: './btn-save.component.html',
  styleUrl: './btn-save.component.scss',
})
export class BtnSaveComponent {
  @Input({ transform: booleanAttribute, required: true }) disabled!: boolean;
}
