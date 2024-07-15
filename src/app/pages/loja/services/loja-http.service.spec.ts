import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment.development';
import { SortOptions } from '../../../@shared/services/http/contracts/search.interface';
import { LojaHttpService } from './loja-http.service';

const url = `${environment.API_URL}/lojas`;

describe('LojaHttpService', () => {
  let service: LojaHttpService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(LojaHttpService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Deve chamar o HTTP DELETE quando o metodo delete for executado', (done) => {
    const idFake = 1;
    service.delete(idFake).subscribe(() => {
      done();
    });

    const req = httpController.expectOne(`${url}/${idFake}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('Deve chamar o HTTP GET quando o metodo findById for executado', (done) => {
    const idFake = 1;
    service.findById(idFake).subscribe(() => {
      done();
    });

    const req = httpController.expectOne(`${url}/${idFake}`);
    expect(req.request.method).toBe('GET');
    req.flush(null);
  });

  it('Deve chamar o HTTP PUT quando o metodo save receber id', (done) => {
    const idFake = 1;
    const fakeBody = {
      descricao: 'Some description',
    };
    service.save(fakeBody, idFake).subscribe(() => {
      done();
    });

    const req = httpController.expectOne(`${url}/${idFake}`);
    expect(req.request.body).toEqual(fakeBody);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('Deve chamar o HTTP POST quando o metodo save NÃO receber id', (done) => {
    const fakeBody = {
      descricao: 'Some description',
    };
    service.save(fakeBody).subscribe(() => {
      done();
    });

    const req = httpController.expectOne(url);
    expect(req.request.body).toEqual(fakeBody);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  describe(LojaHttpService.prototype.search.name, () => {
    it('Deve chamar o HTTP GET quando o metodo search NÃO receber params', (done) => {
      service.search().subscribe(() => {
        done();
      });

      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(null);
    });

    it('Deve chamar o HTTP GET quando o metodo search receber perPage', (done) => {
      const parmsFake = {
        perPage: 5,
      };
      service.search(parmsFake).subscribe(() => {
        done();
      });

      const req = httpController.expectOne(`${url}?perPage=${parmsFake.perPage}`);
      expect(req.request.method).toBe('GET');
      req.flush(null);
    });

    it('Deve chamar o HTTP GET quando o metodo search receber page', (done) => {
      const parmsFake = {
        page: 5,
      };
      service.search(parmsFake).subscribe(() => {
        done();
      });

      const req = httpController.expectOne(`${url}?page=${parmsFake.page}`);
      expect(req.request.method).toBe('GET');
      req.flush(null);
    });

    it('Deve chamar o HTTP GET quando o metodo search receber filter', (done) => {
      const parmsFake = {
        filter: {
          descricao: 'Some',
        },
      };
      service.search(parmsFake).subscribe(() => {
        done();
      });

      const encodedParams = 'filter=%7B%22descricao%22:%22Some%22%7D';

      const req = httpController.expectOne(`${url}?${encodedParams}`);
      expect(req.request.method).toBe('GET');
      req.flush(null);
    });

    it('Deve chamar o HTTP GET quando o metodo search receber sort', (done) => {
      const paramsFake = {
        sort: {
          id: 'ASC' as SortOptions,
        },
      };
      service.search(paramsFake).subscribe(() => {
        done();
      });

      const encodedParams = 'sort=%7B%22id%22:%22ASC%22%7D';

      const req = httpController.expectOne(`${url}?${encodedParams}`);
      expect(req.request.method).toBe('GET');
      req.flush(null);
    });

    it('Deve chamar o HTTP GET quando o metodo search receber todas opçoes', (done) => {
      const paramsFake = {
        perPage: 10,
        page: 2,
        filter: {
          id: 1,
        },
        sort: {
          descricao: 'ASC' as SortOptions,
        },
      };
      service.search(paramsFake).subscribe(() => {
        done();
      });

      const encodedParams =
        'page=2&perPage=10&filter=%7B%22id%22:1%7D&sort=%7B%22descricao%22:%22ASC%22%7D';

      const req = httpController.expectOne(`${url}?${encodedParams}`);
      expect(req.request.method).toBe('GET');
      req.flush(null);
    });
  });
});
