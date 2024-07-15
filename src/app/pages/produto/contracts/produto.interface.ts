import { SortOptions } from '../../../@shared/services/http/contracts/search.interface';

export interface IProduto {
  id: number;
  descricao: string;
  custo: string;
  imagem: string;
  precos: IProdutoLoja[];
}

export interface IProdutoLoja {
  idLoja: number;
  descricaoLoja: string;
  precoVenda: string;
}

export interface IProdutoFilter extends Partial<IProduto> {}

export interface IProdutoSort {
  id?: SortOptions;
  descricao?: SortOptions;
  custo?: SortOptions;
}
