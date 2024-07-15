import { Subscription, debounceTime, filter, switchMap, tap, startWith, Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BtnAddComponent } from '../../../@shared/components/form/buttons/btn-add/btn-add.component';
import { BtnSmallEditComponent } from '../../../@shared/components/form/buttons/btn-small-edit/btn-small-edit.component';
import { BtnSmallRemoveComponent } from '../../../@shared/components/form/buttons/btn-small-remove/btn-small-remove.component';
import { SidebarComponent } from '../../../@shared/components/sidebar/sidebar.component';
import {
  IPaginate,
  PerPageOptions,
} from '../../../@shared/services/data-table/contract/data-tables.interface';
import { DataTableService } from '../../../@shared/services/data-table/data-table.service';
import {
  SearchRequest,
  SearchResponse,
} from '../../../@shared/services/http/contracts/search.interface';
import { IProdutoSort, IProduto, IProdutoFilter } from '../contracts/produto.interface';
import { ProdutoHttpService } from '../services/produto-http.service';

@Component({
  selector: 'fk-produto-consulta',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SidebarComponent,
    BtnAddComponent,
    BtnSmallEditComponent,
    BtnSmallRemoveComponent,
  ],
  templateUrl: './produto-consulta.component.html',
  styleUrl: './produto-consulta.component.scss',
})
export class ProdutoConsultaComponent implements OnInit, OnDestroy {
  produtoList: IProduto[] = [];

  filterForm!: FormGroup;
  perPageForm!: FormGroup;

  paginate: IPaginate<IProdutoSort> = {
    page: 2,
    perPage: 1,
    lastPage: 0,
    total: 0,
    sort: { id: 'DESC' },
  };

  perPageOptions: PerPageOptions[] = [1, 5, 10, 20];

  private subs = new Subscription();

  constructor(
    private readonly httpService: ProdutoHttpService,
    private readonly formBuilder: FormBuilder,
    private readonly dataTableService: DataTableService
  ) {}

  ngOnInit(): void {
    this.formBuild();
    this.idChanges();
    this.descricaoChanges();
    this.custoChanges();
    this.precoVendaChanges();
    this.perPageChanges();
    this.searchProduto(this.paginate);
  }

  ordenar(field: keyof IPaginate<IProdutoSort>['sort']) {
    let direction = 'ASC';

    if (this.paginate.sort[field] === 'ASC') {
      direction = 'DESC';
    }

    this.paginate = {
      ...this.paginate,
      page: 1,
      sort: {
        [field]: direction,
      },
    };

    this.subs.add(this.search$(this.paginate).subscribe());
  }

  navigatePage(page: number | string) {
    if (typeof page !== 'number') {
      return;
    }

    this.paginate = {
      ...this.paginate,
      page,
    };
    this.searchProduto(this.paginate);
  }

  excluirProduto(id: number) {
    this.subs.add(
      this.httpService
        .delete(id)
        .pipe(
          switchMap(() =>
            this.search$({
              ...this.paginate,
              page:
                this.produtoList.length <= 1 && this.paginate.page === this.paginate.lastPage
                  ? this.paginate.lastPage - 1
                  : this.paginate.page,
            })
          )
        )
        .subscribe()
    );
  }

  pageOptions(): (number | string)[] {
    return this.dataTableService.buildPageOptions(this.paginate);
  }

  private formBuild(): void {
    this.filterForm = this.formBuilder.group({
      id: [null],
      descricao: [null],
      custo: [null],
      precoVenda: [null],
    });

    this.perPageForm = this.formBuilder.group({
      perPage: [5],
    });
  }

  private idChanges(): void {
    this.subs.add(
      this.filterForm
        .get('id')
        ?.statusChanges.pipe(
          filter((value) => value === 'VALID'),
          debounceTime(400),
          tap(() => {
            const { precoVenda, ...filter } = this.filterForm.getRawValue();

            this.searchProduto({
              page: 1,
              perPage: this.paginate.perPage,
              sort: this.paginate.sort,
              filter: {
                ...filter,
                precos: {
                  precoVenda,
                },
              },
            });
          })
        )
        .subscribe()
    );
  }

  private descricaoChanges(): void {
    this.subs.add(
      this.filterForm
        .get('descricao')
        ?.statusChanges.pipe(
          filter((value) => value === 'VALID'),
          debounceTime(400),
          tap(() => {
            const { precoVenda, ...filter } = this.filterForm.getRawValue();

            this.searchProduto({
              page: 1,
              perPage: this.paginate.perPage,
              sort: this.paginate.sort,
              filter: {
                ...filter,
                precos: {
                  precoVenda,
                },
              },
            });
          })
        )
        .subscribe()
    );
  }

  private custoChanges(): void {
    this.subs.add(
      this.filterForm
        .get('custo')
        ?.statusChanges.pipe(
          filter((value) => value === 'VALID'),
          debounceTime(400),
          tap(() => {
            const { precoVenda, ...filter } = this.filterForm.getRawValue();

            this.searchProduto({
              page: 1,
              perPage: this.paginate.perPage,
              sort: this.paginate.sort,
              filter: {
                ...filter,
                precos: {
                  precoVenda,
                },
              },
            });
          })
        )
        .subscribe()
    );
  }

  private precoVendaChanges(): void {
    this.subs.add(
      this.filterForm
        .get('precoVenda')
        ?.statusChanges.pipe(
          filter((value) => value === 'VALID'),
          debounceTime(400),
          tap(() => {
            const { precoVenda, ...filter } = this.filterForm.getRawValue();

            this.searchProduto({
              page: 1,
              perPage: this.paginate.perPage,
              sort: this.paginate.sort,
              filter: {
                ...filter,
                precos: {
                  precoVenda,
                },
              },
            });
          })
        )
        .subscribe()
    );
  }

  private perPageChanges(): void {
    this.subs.add(
      this.perPageForm
        .get('perPage')
        ?.valueChanges.pipe(
          startWith(5),
          tap((value) => {
            this.paginate = {
              ...this.paginate,
              page: 1,
              perPage: value,
            };

            this.searchProduto(this.paginate);
          })
        )
        .subscribe()
    );
  }

  private searchProduto(options?: SearchRequest<IProdutoFilter, IProdutoSort>): void {
    this.subs.add(this.search$(options).subscribe());
  }

  private search$(
    options?: SearchRequest<IProdutoFilter, IProdutoSort>
  ): Observable<SearchResponse<IProduto[]>> {
    return this.httpService.search(options).pipe(
      tap((response) => {
        this.produtoList = response.data;
        this.paginate = {
          ...this.paginate,
          page: response.page,
          total: response.total,
          lastPage: response.lastPage,
        };
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
