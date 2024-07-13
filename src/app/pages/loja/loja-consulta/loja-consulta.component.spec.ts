/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, of } from 'rxjs';

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';

import { LojaHttpService } from '../services/loja-http.service';
import { LojaConsultaComponent } from './loja-consulta.component';

describe('LojaConsultaComponent', () => {
  let component: LojaConsultaComponent;
  let fixture: ComponentFixture<LojaConsultaComponent>;
  let lojaHttpServiceMock: jasmine.SpyObj<LojaHttpService>;
  let activatedRouteMock: { params: BehaviorSubject<Params>; snapshot: any };

  beforeEach(async () => {
    lojaHttpServiceMock = {
      delete: jasmine.createSpy('save').and.returnValue(of(undefined)),
      search: jasmine.createSpy('findById').and.returnValue(
        of({
          data: [{ id: 1, descricao: 'Some description' }],
          page: 1,
          perPage: 10,
        })
      ),
    } as any;

    activatedRouteMock = {
      params: new BehaviorSubject<Params>({ id: '123' }),
      snapshot: { paramMap: { get: () => '123' } },
    };

    await TestBed.configureTestingModule({
      imports: [LojaConsultaComponent],
      providers: [
        { provide: LojaHttpService, useValue: lojaHttpServiceMock },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LojaConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deve fazer uma nova busca quando perPage for alterado', fakeAsync(() => {
    const descricaoInput: HTMLInputElement = fixture.nativeElement.querySelector('#perPage');
    descricaoInput.value = '20';
    descricaoInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    tick(500);

    expect(lojaHttpServiceMock.search).toHaveBeenCalledWith({
      page: 1,
      perPage: '20',
      lastPage: undefined,
      total: undefined,
      sort: { id: 'DESC' },
    } as any);
  }));

  it('Deve fazer uma nova busca quando filtro de descricao for alterado', fakeAsync(() => {
    const descricaoInput: HTMLInputElement = fixture.nativeElement.querySelector('#descricao');
    descricaoInput.value = 'Find description';
    descricaoInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    tick(500);

    expect(lojaHttpServiceMock.search).toHaveBeenCalledWith({
      page: 1,
      perPage: 5,
      sort: { id: 'DESC' },
      filter: { id: null, descricao: 'Find description' } as any,
    });
  }));

  it('Deve fazer uma nova busca quando filtro de id for alterado', fakeAsync(() => {
    const descricaoInput: HTMLInputElement = fixture.nativeElement.querySelector('#codigo');
    descricaoInput.value = '7';
    descricaoInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    tick(500);

    expect(lojaHttpServiceMock.search).toHaveBeenCalledWith({
      page: 1,
      perPage: 5,
      sort: { id: 'DESC' },
      filter: { id: '7', descricao: null } as any,
    });
  }));

  it('Deve fazer uma nova busca quando delete for realizado', () => {
    lojaHttpServiceMock.search.calls.reset();
    component.excluirLoja(13);

    expect(lojaHttpServiceMock.delete).toHaveBeenCalledWith(13);
    expect(lojaHttpServiceMock.search).toHaveBeenCalledWith({
      page: 1,
      perPage: 5,
      lastPage: undefined,
      total: undefined,
      sort: { id: 'DESC' },
    } as any);
  });

  it('Deve fazer uma nova busca voltando uma pagina quando delete for realizado na ultima pagina que ultimo registro', () => {
    component.lojaList = [
      {
        id: 1,
        descricao: 'Some description 1',
      },
    ];

    component.paginate = {
      page: 2,
      perPage: 1,
      lastPage: 2,
      sort: { id: 'ASC' },
      total: 2,
    };

    component.excluirLoja(2);

    fixture.detectChanges();

    expect(lojaHttpServiceMock.delete).toHaveBeenCalledWith(2);
    expect(lojaHttpServiceMock.search).toHaveBeenCalledWith({
      page: 1,
      perPage: 1,
      lastPage: 2,
      sort: { id: 'ASC' },
      total: 2,
    } as any);
  });

  it('Deve fazer uma nova busca quando uma pagina for clicada', () => {
    const arrangePages = [2, 3, 10, 100];

    for (const page of arrangePages) {
      component.navigatePage(page);

      expect(lojaHttpServiceMock.search).toHaveBeenCalledWith({
        page,
        perPage: 5,
        lastPage: undefined,
        total: undefined,
        sort: { id: 'DESC' },
      } as any);
    }
  });

  it('MÃO Deve fazer uma nova busca quando uma pagina for clicada com valor não numerico', () => {
    lojaHttpServiceMock.search.calls.reset();
    component.navigatePage('...');

    expect(lojaHttpServiceMock.search).not.toHaveBeenCalled();
  });

  it('Deve order quando coluna for clicada', () => {
    lojaHttpServiceMock.search.calls.reset();
    const colunaElement: HTMLElement = fixture.nativeElement.querySelector('th.codigo');
    colunaElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(lojaHttpServiceMock.search).toHaveBeenCalledWith({
      page: 1,
      perPage: 5,
      lastPage: undefined,
      total: undefined,
      sort: { id: 'ASC' },
    } as any);

    colunaElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(lojaHttpServiceMock.search).toHaveBeenCalledWith({
      page: 1,
      perPage: 5,
      lastPage: undefined,
      total: undefined,
      sort: { id: 'DESC' },
    } as any);
  });

  it('Deve realizar o unsubscribe quando component for destruido', () => {
    const unsubscribeSpy = spyOn(component['subs'], 'unsubscribe');
    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
