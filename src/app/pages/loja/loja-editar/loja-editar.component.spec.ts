/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';

import { LojaHttpService } from '../services/loja-http.service';
import { LojaEditarComponent } from './loja-editar.component';

describe('LojaEditarComponent', () => {
  let component: LojaEditarComponent;
  let fixture: ComponentFixture<LojaEditarComponent>;
  let lojaHttpServiceMock: jasmine.SpyObj<LojaHttpService>;
  let activatedRouteMock: { params: BehaviorSubject<Params>; snapshot: any };

  beforeEach(async () => {
    lojaHttpServiceMock = {
      save: jasmine
        .createSpy('save')
        .and.returnValue(of({ id: '123', descricao: 'Some description' })),
      findById: jasmine
        .createSpy('findById')
        .and.returnValue(of({ id: '123', descricao: 'Some description' })),
    } as any;

    activatedRouteMock = {
      params: new BehaviorSubject<Params>({ id: '123' }),
      snapshot: { paramMap: { get: () => '123' } },
    };

    await TestBed.configureTestingModule({
      imports: [LojaEditarComponent],
      providers: [
        { provide: LojaHttpService, useValue: lojaHttpServiceMock },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LojaEditarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deve inicializar o formulario quando o component for instanciado ', () => {
    const form = component.form;

    expect(form).toBeDefined();
    expect(form.get('id')).toBeTruthy();
    expect(form.get('descricao')).toBeTruthy();
    expect(form.get('id')?.disabled).toBeTrue();
  });

  it('Deve buscar o recurso quando params conter um id valido', () => {
    expect(lojaHttpServiceMock.findById).toHaveBeenCalledWith(123);
  });

  it('Deve buscar realizar reset do formulario quando params form "cadastrar"', () => {
    activatedRouteMock.params.next({ id: 'cadastrar' });
    fixture.detectChanges();

    const form = component.form;

    expect(form).toBeDefined();
    expect(form.get('id')?.value).toBeNull();
    expect(form.get('descricao')?.value).toBeNull();
  });

  it('Deve realizar o unsubscribe quando component for destruido', () => {
    const unsubscribeSpy = spyOn(component['subs'], 'unsubscribe');
    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('Deve permitir salvar quando o formulário for valido', () => {
    const descricaoInput: HTMLInputElement = fixture.nativeElement.querySelector('#descricao');
    descricaoInput.value = 'New Description';
    descricaoInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    component.onSave();

    expect(lojaHttpServiceMock.save).toHaveBeenCalledWith({ descricao: 'New Description' }, 123);
  });
});
