import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnSmallEditComponent } from './btn-small-edit.component';

describe('BtnSmallEditComponent', () => {
  let component: BtnSmallEditComponent;
  let fixture: ComponentFixture<BtnSmallEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnSmallEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BtnSmallEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
