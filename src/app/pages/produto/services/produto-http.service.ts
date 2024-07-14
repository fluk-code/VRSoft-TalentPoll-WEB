import { Observable, take } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment.development';
import {
  SearchRequest,
  SearchResponse,
} from '../../../@shared/services/http/contracts/search.interface';
import { IProduto, IProdutoFilter, IProdutoSort } from '../contracts/produto.interface';

@Injectable({
  providedIn: 'root',
})
export class ProdutoHttpService {
  private url = `${environment.API_URL}/produtos`;

  constructor(private http: HttpClient) {}

  search(
    options?: SearchRequest<IProdutoFilter, IProdutoSort>
  ): Observable<SearchResponse<IProduto[]>> {
    let params = new HttpParams();
    if (options?.page !== undefined && options?.page !== null) {
      params = params.set('page', options.page);
    }

    if (options?.perPage !== undefined && options?.perPage !== null) {
      params = params.set('perPage', options.perPage);
    }

    if (options?.filter) {
      params = params.set('filter', JSON.stringify(options.filter));
    }

    if (options?.sort) {
      params = params.set('sort', JSON.stringify(options.sort));
    }

    return this.http.get<SearchResponse<IProduto[]>>(this.url, { params }).pipe(take(1));
  }

  save(body: Omit<IProduto, 'id'>, id?: number): Observable<IProduto> {
    if (id) {
      return this.http.put<IProduto>(`${this.url}/${id}`, body).pipe(take(1));
    }

    return this.http.post<IProduto>(this.url, body).pipe(take(1));
  }

  findById(id: number): Observable<IProduto> {
    return this.http.get<IProduto>(`${this.url}/${id}`).pipe(take(1));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(take(1));
  }
}
