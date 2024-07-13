import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { BtnSmallEditComponent } from '../../@shared/components/form/buttons/btn-small-edit/btn-small-edit.component';
import { BtnSmallRemoveComponent } from '../../@shared/components/form/buttons/btn-small-remove/btn-small-remove.component';

@Component({
  selector: 'fk-home',
  standalone: true,
  imports: [CommonModule, BtnSmallEditComponent, BtnSmallRemoveComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  lojaList: {
    id: number;
    descricao: string;
  }[] = [
    {
      id: 1,
      descricao: 'LOJA 1',
    },
    {
      id: 2,
      descricao: 'LOJA 1',
    },
  ];
}
