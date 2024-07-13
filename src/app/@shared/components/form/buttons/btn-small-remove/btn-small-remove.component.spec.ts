import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnSmallRemoveComponent } from './btn-small-remove.component';

describe('BtnSmallRemoveComponent', () => {
  let component: BtnSmallRemoveComponent;
  let fixture: ComponentFixture<BtnSmallRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnSmallRemoveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BtnSmallRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
