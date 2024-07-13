import { Routes } from '@angular/router';

import { PagesComponent } from './pages.component';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then((c) => c.HomeComponent),
      },
      {
        path: 'lojas',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./loja/loja-consulta/loja-consulta.component').then(
                (c) => c.LojaConsultaComponent
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./loja/loja-editar/loja-editar.component').then((c) => c.LojaEditarComponent),
          },
        ],
      },
      { path: '', redirectTo: 'lojas', pathMatch: 'full' },
    ],
  },
];
