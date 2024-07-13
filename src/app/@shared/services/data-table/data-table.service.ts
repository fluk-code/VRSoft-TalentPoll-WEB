import { Injectable } from '@angular/core';

import { IPaginate } from './contract/data-tables.interface';

@Injectable({
  providedIn: 'root',
})
export class DataTableService {
  buildPageOptions<Sort>(paginate: IPaginate<Sort>): (number | string)[] {
    const currentPage = paginate.page;

    if (paginate.lastPage <= 1) {
      return [];
    }

    const options: (number | string)[] = [];

    options.push(1);
    if (paginate.lastPage > 2) {
      options.push(2);
    }

    if (currentPage > 4) {
      options.push('...');
    }

    if (currentPage > 3) {
      options.push(currentPage - 1);
    }

    if (currentPage > 2 && currentPage < paginate.lastPage) {
      options.push(currentPage);
    }

    if (currentPage < paginate.lastPage - 1 && currentPage > 1) {
      options.push(currentPage + 1);
    }

    if (currentPage < paginate.lastPage - 3) {
      options.push('...');
    }

    if (currentPage < paginate.lastPage - 2) {
      options.push(paginate.lastPage - 1);
    }
    options.push(paginate.lastPage);

    return options;
  }
}
