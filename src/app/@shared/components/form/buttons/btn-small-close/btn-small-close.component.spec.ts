import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnSmallCloseComponent } from './btn-small-close.component';

describe('BtnSmallCloseComponent', () => {
  let component: BtnSmallCloseComponent;
  let fixture: ComponentFixture<BtnSmallCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnSmallCloseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BtnSmallCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
