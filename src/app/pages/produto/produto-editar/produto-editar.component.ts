import { Observable, Subscription, filter, finalize, map, switchMap, tap } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { BtnAddComponent } from '../../../@shared/components/form/buttons/btn-add/btn-add.component';
import { BtnBackComponent } from '../../../@shared/components/form/buttons/btn-back/btn-back.component';
import { BtnSaveComponent } from '../../../@shared/components/form/buttons/btn-save/btn-save.component';
import { BtnSmallAddComponent } from '../../../@shared/components/form/buttons/btn-small-add/btn-small-add.component';
import { BtnSmallCloseComponent } from '../../../@shared/components/form/buttons/btn-small-close/btn-small-close.component';
import { BtnSmallEditComponent } from '../../../@shared/components/form/buttons/btn-small-edit/btn-small-edit.component';
import { BtnSmallRemoveComponent } from '../../../@shared/components/form/buttons/btn-small-remove/btn-small-remove.component';
import { ModalRef } from '../../../@shared/components/modal/modal-ref';
import { ModalService } from '../../../@shared/components/modal/service/modal.service';
import { SidebarComponent } from '../../../@shared/components/sidebar/sidebar.component';
import { ILoja } from '../../loja/contracts/loja.interface';
import { LojaHttpService } from '../../loja/services/loja-http.service';
import { IProdutoLoja } from '../contracts/produto.interface';
import { ProdutoHttpService } from '../services/produto-http.service';

@Component({
  selector: 'fk-produto-editar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SidebarComponent,
    BtnBackComponent,
    BtnAddComponent,
    BtnSaveComponent,
    BtnSmallEditComponent,
    BtnSmallRemoveComponent,
    BtnSmallAddComponent,
    BtnSmallCloseComponent,
  ],
  templateUrl: './produto-editar.component.html',
  styleUrl: './produto-editar.component.scss',
})
export class ProdutoEditarComponent {
  precoList: IProdutoLoja[] = [];
  lojaList: ILoja[] = [];
  formProduto!: FormGroup;
  formAddPrecos!: FormGroup;

  private subs = new Subscription();

  @ViewChild('modal') public modalTemplateRef!: TemplateRef<HTMLFormElement>;
  public modalRef!: ModalRef;

  constructor(
    private readonly router: Router,
    private readonly activateRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly produtoHttpService: ProdutoHttpService,
    private readonly lojaHttpService: LojaHttpService,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.formBuild();
    this.paramsChanges();
  }
  onSave() {
    const { id, ...otherValues } = this.formProduto.getRawValue();

    this.formProduto.valid &&
      this.subs.add(
        this.produtoHttpService
          .save(otherValues, Number(id))
          .pipe(
            tap(({ id }) => {
              this.router.navigate(['produtos', id]);
            })
          )
          .subscribe()
      );
  }

  onAddPreco() {
    const body = this.formAddPrecos.getRawValue();
    const { id } = this.formProduto.getRawValue();

    this.formProduto.valid &&
      this.subs.add(
        this.produtoHttpService
          .addPreco(id, body)
          .pipe(
            switchMap(() => this.findProduto$(id)),
            finalize(() => {
              this.formAddPrecos.reset();
              this.closeModal();
            })
          )
          .subscribe()
      );
  }

  onRemovePreco(idLoja: number) {
    const { id } = this.formProduto.getRawValue();

    this.formProduto.valid &&
      this.subs.add(
        this.produtoHttpService
          .removePreco(id, idLoja)
          .pipe(
            switchMap(() => this.findProduto$(id)),
            finalize(() => {
              this.formAddPrecos.reset();
              this.closeModal();
            })
          )
          .subscribe()
      );
  }

  private formBuild() {
    this.formProduto = this.formBuilder.group({
      id: [
        {
          value: null,
          disabled: true,
        },
        [],
      ],
      descricao: [null, [Validators.required, Validators.max(60)]],
      custo: [null, [Validators.required, Validators.min(0)]],
    });

    this.formAddPrecos = this.formBuilder.group({
      idLoja: [null],
      precoVenda: [null],
    });
  }

  private paramsChanges() {
    this.subs.add(
      this.activateRoute.params
        .pipe(
          filter(({ id }) => {
            const isEditMode = id !== 'cadastrar';

            if (isEditMode) {
              this.formProduto.get('id')?.setValue(Number(id));
            } else {
              this.formProduto.reset();
            }

            return isEditMode;
          }),
          switchMap(({ id }) => this.findProduto$(Number(id)))
        )
        .subscribe()
    );
  }

  private findProduto$(id: number): Observable<ILoja[]> {
    return this.produtoHttpService.findById(id).pipe(
      tap((response) => {
        this.formProduto.setValue({
          id: response.id,
          descricao: response.descricao,
          custo: response.custo,
        });
        this.precoList = response.precos;
      }),
      map((response) => response.precos.map((produtoLoja) => produtoLoja.idLoja)),
      switchMap(() => this.findLojas$())
    );
  }

  private findLojas$() {
    return this.lojaHttpService.findAll().pipe(
      tap((lojaList) =>
        lojaList.map((loja) => {
          this.lojaList = [...lojaList];

          this.precoList.forEach((produtoLoja) => {
            if (produtoLoja.idLoja === loja.id) {
              produtoLoja.descricaoLoja = loja.descricao;
            }
          });
        })
      )
    );
  }

  public showModalAddPreco(): void {
    this.modalRef = this.modalService.open({
      templateRef: this.modalTemplateRef,
      title: 'Adiciona preço produto',
    });
  }

  public showModalAlterarPreco(idLoja: number, precoVenda: string): void {
    this.formAddPrecos.setValue({
      idLoja,
      precoVenda,
    });

    this.modalRef = this.modalService.open({
      templateRef: this.modalTemplateRef,
      title: 'Adiciona preço produto',
    });
  }

  public closeModal() {
    this.formAddPrecos.reset();
    this.modalRef.close();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
