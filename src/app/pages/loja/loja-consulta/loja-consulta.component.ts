import { Observable, Subscription, debounceTime, filter, startWith, switchMap, tap } from 'rxjs';

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
import { ILoja, ILojaFilter, ILojaSort } from '../contracts/loja.interface';
import { LojaHttpService } from '../services/loja-http.service';

@Component({
  selector: 'fk-loja-consulta',
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
  templateUrl: './loja-consulta.component.html',
  styleUrl: './loja-consulta.component.scss',
})
export class LojaConsultaComponent implements OnInit, OnDestroy {
  lojaList: ILoja[] = [];

  filterForm!: FormGroup;
  perPageForm!: FormGroup;

  paginate: IPaginate<ILojaSort> = {
    page: 2,
    perPage: 1,
    lastPage: 0,
    total: 0,
    sort: { id: 'DESC' },
  };

  perPageOptions: PerPageOptions[] = [1, 5, 10, 20];

  private subs = new Subscription();

  constructor(
    private readonly lojaHttpService: LojaHttpService,
    private readonly formBuilder: FormBuilder,
    private readonly dataTableService: DataTableService
  ) {}

  ngOnInit(): void {
    this.formBuild();
    this.idChanges();
    this.descricaoChanges();
    this.perPageChanges();
    this.searchLoja(this.paginate);
  }

  ordenar(field: keyof IPaginate<ILojaSort>['sort']) {
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

    this.subs.add(this.searchLoja$(this.paginate).subscribe());
  }

  navigatePage(page: number | string) {
    if (typeof page !== 'number') {
      return;
    }

    this.paginate = {
      ...this.paginate,
      page,
    };
    this.searchLoja(this.paginate);
  }

  excluirLoja(id: number) {
    this.subs.add(
      this.lojaHttpService
        .delete(id)
        .pipe(
          switchMap(() =>
            this.searchLoja$({
              ...this.paginate,
              page:
                this.lojaList.length <= 1 && this.paginate.page === this.paginate.lastPage
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
            const filter = this.filterForm.getRawValue() as ILoja;
            this.searchLoja({
              page: 1,
              perPage: this.paginate.perPage,
              sort: this.paginate.sort,
              filter,
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
            const { id, descricao } = this.filterForm.getRawValue();

            this.searchLoja({
              page: 1,
              perPage: this.paginate.perPage,
              sort: this.paginate.sort,
              filter: {
                id,
                descricao,
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

            this.searchLoja(this.paginate);
          })
        )
        .subscribe()
    );
  }

  private searchLoja(options?: SearchRequest<ILojaFilter, ILojaSort>): void {
    this.subs.add(this.searchLoja$(options).subscribe());
  }

  private searchLoja$(
    options?: SearchRequest<ILojaFilter, ILojaSort>
  ): Observable<SearchResponse<ILoja[]>> {
    return this.lojaHttpService.search(options).pipe(
      tap((response) => {
        this.lojaList = response.data;
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
