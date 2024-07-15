/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';

import { ModalService } from '../../../@shared/components/modal/service/modal.service';
import { LojaHttpService } from '../../loja/services/loja-http.service';
import { ProdutoHttpService } from '../services/produto-http.service';
import { ProdutoEditarComponent } from './produto-editar.component';

describe('ProdutoEditarComponent', () => {
  let component: ProdutoEditarComponent;
  let fixture: ComponentFixture<ProdutoEditarComponent>;
  let lojaHttpServiceMock: jasmine.SpyObj<LojaHttpService>;
  let prdutoHttpServiceMock: jasmine.SpyObj<ProdutoHttpService>;
  let activatedRouteMock: { params: BehaviorSubject<Params>; snapshot: any };
  let modalServiceMock: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    modalServiceMock = {
      open: jasmine.createSpy('save').and.returnValue(null),
    } as any;

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

    prdutoHttpServiceMock = {
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
      imports: [ProdutoEditarComponent],
      providers: [
        { provide: ProdutoHttpService, useValue: prdutoHttpServiceMock },
        { provide: LojaHttpService, useValue: lojaHttpServiceMock },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
        { provide: ModalService, useValue: modalServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
