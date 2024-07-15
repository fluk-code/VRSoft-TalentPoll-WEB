import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FooterComponent } from '../@shared/components/footer/footer.component';
import { BodyInjectorService } from '../@shared/components/modal/service/body-injector.service';
import { ModalService } from '../@shared/components/modal/service/modal.service';
import { NavbarComponent } from '../@shared/components/navbar/navbar.component';
import { SidebarComponent } from '../@shared/components/sidebar/sidebar.component';
import { FocusBackDirective } from '../@shared/directives/focus.back.directive';
import { FocusTrapDirective } from '../@shared/directives/focus.trap.directive';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [PagesComponent],
  imports: [PagesRoutingModule, CommonModule, NavbarComponent, SidebarComponent, FooterComponent],
  providers: [ModalService, BodyInjectorService, FocusTrapDirective, FocusBackDirective],
})
export class PagesModule {}
