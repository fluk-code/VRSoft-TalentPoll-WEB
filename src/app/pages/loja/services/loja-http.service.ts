import { Observable, take } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment.development';
import {
  SearchRequest,
  SearchResponse,
} from '../../../@shared/services/http/contracts/search.interface';
import { ILoja, ILojaFilter, ILojaSort } from '../contracts/loja.interface';

@Injectable({
  providedIn: 'root',
})
export class LojaHttpService {
  private url = `${environment.API_URL}/lojas`;

  constructor(private http: HttpClient) {}

  search(options?: SearchRequest<ILojaFilter, ILojaSort>): Observable<SearchResponse<ILoja[]>> {
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

    return this.http.get<SearchResponse<ILoja[]>>(this.url, { params }).pipe(take(1));
  }

  save(body: Omit<ILoja, 'id'>, id?: number): Observable<ILoja> {
    if (id) {
      return this.http.put<ILoja>(`${this.url}/${id}`, body).pipe(take(1));
    }

    return this.http.post<ILoja>(this.url, body).pipe(take(1));
  }

  findById(id: number): Observable<ILoja> {
    return this.http.get<ILoja>(`${this.url}/${id}`).pipe(take(1));
  }

  findAll(): Observable<ILoja[]> {
    const params = new HttpParams().set('type', 'all');
    return this.http
      .get<ILoja[]>(`${this.url}`, {
        params,
      })
      .pipe(take(1));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(take(1));
  }
}
