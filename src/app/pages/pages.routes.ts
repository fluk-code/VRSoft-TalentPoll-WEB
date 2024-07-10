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
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
