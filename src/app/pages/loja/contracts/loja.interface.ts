import { SortOptions } from '../../../@shared/services/http/contracts/search.interface';

export interface ILoja {
  id: number;
  descricao: string;
}

export interface ILojaFilter extends Partial<ILoja> {}

export interface ILojaSort {
  id?: SortOptions;
  descricao?: SortOptions;
}
