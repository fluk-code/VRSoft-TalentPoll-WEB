import { Observable, Subscription, filter, switchMap, tap } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { BtnAddComponent } from '../../../@shared/components/form/buttons/btn-add/btn-add.component';
import { BtnBackComponent } from '../../../@shared/components/form/buttons/btn-back/btn-back.component';
import { BtnSaveComponent } from '../../../@shared/components/form/buttons/btn-save/btn-save.component';
import { SidebarComponent } from '../../../@shared/components/sidebar/sidebar.component';
import { ILoja } from '../contracts/loja.interface';
import { LojaHttpService } from '../services/loja-http.service';

@Component({
  selector: 'fk-loja-editar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SidebarComponent,
    BtnBackComponent,
    BtnAddComponent,
    BtnSaveComponent,
  ],
  templateUrl: './loja-editar.component.html',
  styleUrl: './loja-editar.component.scss',
})
export class LojaEditarComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  private subs = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly activateRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly lojaHttpService: LojaHttpService
  ) {}

  ngOnInit(): void {
    this.formBuild();
    this.paramsChanges();
  }

  onSave() {
    const { id, ...otherValues } = this.form.getRawValue();

    this.form.valid &&
      this.subs.add(
        this.lojaHttpService
          .save(otherValues, Number(id))
          .pipe(
            tap(({ id }) => {
              this.router.navigate(['lojas', id]);
            })
          )
          .subscribe()
      );
  }

  private formBuild() {
    this.form = this.formBuilder.group({
      id: [
        {
          value: null,
          disabled: true,
        },
        [],
      ],
      descricao: [null, [Validators.required, Validators.max(60)]],
    });
  }

  private paramsChanges() {
    this.subs.add(
      this.activateRoute.params
        .pipe(
          filter(({ id }) => {
            const isEditMode = id !== 'cadastrar';

            if (isEditMode) {
              this.form.get('id')?.setValue(Number(id));
            } else {
              this.form.reset();
            }

            return isEditMode;
          }),
          switchMap(({ id }) => this.findLoja(Number(id)))
        )
        .subscribe()
    );
  }

  private findLoja(id: number): Observable<ILoja> {
    return this.lojaHttpService.findById(id).pipe(
      tap((response) => {
        this.form.setValue(response);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
