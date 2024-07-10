import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FooterComponent } from '../@shared/components/footer/footer.component';
import { NavbarComponent } from '../@shared/components/navbar/navbar.component';
import { SidebarComponent } from '../@shared/components/sidebar/sidebar.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [PagesComponent],
  imports: [PagesRoutingModule, CommonModule, NavbarComponent, SidebarComponent, FooterComponent],
})
export class PagesModule {}
