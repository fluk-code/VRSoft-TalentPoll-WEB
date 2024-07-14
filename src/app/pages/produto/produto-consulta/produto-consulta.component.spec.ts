/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';

import { LojaHttpService } from '../../loja/services/loja-http.service';
import { ProdutoHttpService } from '../services/produto-http.service';
import { ProdutoConsultaComponent } from './produto-consulta.component';

describe('ProdutoConsultaComponent', () => {
  let component: ProdutoConsultaComponent;
  let fixture: ComponentFixture<ProdutoConsultaComponent>;
  let httpServiceMock: jasmine.SpyObj<LojaHttpService>;
  let activatedRouteMock: { params: BehaviorSubject<Params>; snapshot: any };

  beforeEach(async () => {
    httpServiceMock = {
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
      imports: [ProdutoConsultaComponent],
      providers: [
        { provide: ProdutoHttpService, useValue: httpServiceMock },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
