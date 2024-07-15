export interface SearchResponse<Data> {
  data: Data;
  page: number;
  lastPage: number;
  total: number;
}

export interface SearchRequest<DataFilter, DataSort> {
  page?: number;
  perPage?: number;
  filter?: DataFilter;
  sort?: DataSort;
}

export type SortOptions = 'ASC' | 'DESC';
