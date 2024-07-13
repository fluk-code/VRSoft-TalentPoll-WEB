import { TestBed } from '@angular/core/testing';

import { DataTableService } from './data-table.service';

describe(DataTableService.name, () => {
  let service: DataTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // eslint-disable-next-line sonarjs/cognitive-complexity
  describe(DataTableService.prototype.buildPageOptions.name, () => {
    it('Deve retornar um array vazio quando a ultima pagina for igual ou menor que 1', () => {
      const arrangeLastPage = [0, 1];

      for (const lastPage of arrangeLastPage) {
        const pageOptions = service.buildPageOptions({
          lastPage,
          page: 1,
          sort: {},
          perPage: 10,
          total: 10,
        });

        expect(pageOptions).toEqual([]);
      }
    });

    it('Deve retornar um conter pagina 1 e 2 quando a ultima pagina for maior que 1', () => {
      const arrangeLastPage = [2, 3, 4, 10, 100];

      for (const lastPage of arrangeLastPage) {
        const pageOptions = service.buildPageOptions({
          lastPage,
          page: 1,
          sort: {},
          perPage: 10,
          total: 10,
        });

        expect(pageOptions.includes(1)).toBeTrue();
        expect(pageOptions.includes(2)).toBeTrue();
      }
    });

    it('Deve retornar um conter pagina 1 à 4 sem reticencias (...) quando a ultima pagina for menor que 4', () => {
      const arrangeLastPage = [3, 4];

      for (const lastPage of arrangeLastPage) {
        const pageOptions = service.buildPageOptions({
          lastPage,
          page: 1,
          sort: {},
          perPage: 10,
          total: 10,
        });

        expect(pageOptions.includes(1)).toBeTrue();
        expect(pageOptions.includes(2)).toBeTrue();
        expect(pageOptions.includes(3)).toBeTrue();
        lastPage === 4 && expect(pageOptions.includes(4)).toBeTrue();
        expect(pageOptions.includes('...')).toBeFalse();
      }
    });

    it('Deve retornar um conter pagina 1 e 2 e reticencias (...) quando a ultima pagina for maior que 4', () => {
      const arrangeLastPage = [5, 6, 10, 100];

      for (const lastPage of arrangeLastPage) {
        const pageOptions = service.buildPageOptions({
          lastPage,
          page: 1,
          sort: {},
          perPage: 10,
          total: 10,
        });

        expect(pageOptions.includes(1)).toBeTrue();
        expect(pageOptions.includes(2)).toBeTrue();
        expect(pageOptions.includes('...')).toBeTrue();
      }
    });

    it('Deve retornar um conter pagina 1 e 2 ... pagina seleciona, uma antes e uma apos quando a pagina selecionada estiver no meio', () => {
      const arrangePageSelected = [
        {
          page: 5,
          containsExpected: [4, 5, 6],
        },
        {
          page: 6,
          containsExpected: [5, 6, 7],
        },
        {
          page: 10,
          containsExpected: [9, 10, 11],
        },
        {
          page: 50,
          containsExpected: [49, 50, 51],
        },
      ];

      for (const { page, containsExpected } of arrangePageSelected) {
        const pageOptions = service.buildPageOptions({
          lastPage: 60,
          page,
          sort: {},
          perPage: 10,
          total: 10,
        });

        expect(pageOptions.includes(1)).toBeTrue();
        expect(pageOptions.includes(2)).toBeTrue();
        expect(pageOptions.includes('...')).toBeTrue();

        for (const contains of containsExpected) {
          expect(pageOptions.includes(contains)).toBeTrue();
        }
      }
    });

    it('Deve retornar um conter pagina ultima e penultima pagina quando a ultima pagina for maior 5', () => {
      const arrangeLastPage = [6, 10, 50, 100];

      for (const lastPage of arrangeLastPage) {
        const pageOptions = service.buildPageOptions({
          lastPage,
          page: 1,
          sort: {},
          perPage: 10,
          total: 10,
        });

        expect(pageOptions.includes(lastPage)).toBeTrue();
        expect(pageOptions.includes(lastPage - 1)).toBeTrue();
      }
    });

    it('Deve retornar um conter 1, 2 ..., selecionados arrange, ..., ultimas paginas quando a pagina selecionada quando a ultima pagina for maior for menor que a anti penultima pagina', () => {
      const arrangePage = [
        {
          page: 6,
          lastPage: 50,
          containsExpected: [1, 2, '...', 5, 6, 7, '...', 49, 50],
        },
        {
          page: 10,
          lastPage: 50,
          containsExpected: [1, 2, '...', 9, 10, 11, '...', 49, 50],
        },
        {
          page: 90,
          lastPage: 100,
          containsExpected: [1, 2, '...', 89, 90, 91, '...', 99, 100],
        },
      ];

      for (const { page, lastPage, containsExpected } of arrangePage) {
        const pageOptions = service.buildPageOptions({
          lastPage,
          page,
          sort: {},
          perPage: 10,
          total: 10,
        });

        expect(pageOptions).toEqual(containsExpected);
      }
    });
  });
});
