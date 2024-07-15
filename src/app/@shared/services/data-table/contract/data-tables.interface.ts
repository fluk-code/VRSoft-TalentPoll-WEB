export type PerPageOptions = 1 | 5 | 10 | 20;

export interface IPaginate<Sort> {
  page: number;
  perPage: PerPageOptions;
  total: number;
  lastPage: number;
  sort: Sort;
}
