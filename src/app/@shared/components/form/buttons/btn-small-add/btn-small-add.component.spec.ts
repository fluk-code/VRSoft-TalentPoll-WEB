import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnSmallAddComponent } from './btn-small-add.component';

describe('BtnSmallAddComponent', () => {
  let component: BtnSmallAddComponent;
  let fixture: ComponentFixture<BtnSmallAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnSmallAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BtnSmallAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
