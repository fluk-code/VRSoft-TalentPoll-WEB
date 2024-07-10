import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeChangerComponent } from './theme-changer.component';

describe(ThemeChangerComponent.name, () => {
  let component: ThemeChangerComponent;
  let fixture: ComponentFixture<ThemeChangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeChangerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(ThemeChangerComponent.prototype.ngOnInit.name, () => {
    it('deve utilizar theme LIGHT quando não existir nenhum tema definido no localStorage', () => {
      expect(component.isLightTheme).toBeTruthy();
    });

    it('deve utilizar theme do localStorage quando o tema estiver definido no localStorage como LIGHT', () => {
      spyOn(window.localStorage, 'getItem').and.returnValues('light');
      expect(component.isLightTheme).toBeTruthy();
    });

    it('deve utilizar theme do localStorage quando o tema estiver definido no localStorage como DARK', () => {
      spyOn(window.localStorage, 'getItem').and.returnValues('dark');
      expect(component.isLightTheme).toBeFalse();
    });

    it('deve utilizar theme do localStorage quando o tema definido no localStorage for invalido', () => {
      spyOn(window.localStorage, 'getItem').and.returnValues('invalid-theme');
      expect(component.isLightTheme).toBeTruthy();
    });
  });

  describe('Change Theme', () => {
    it('deve trocar o tema para LIGHT quando o checkbox for clicado e estive em DARK', () => {
      spyOn(window.localStorage, 'getItem').and.returnValues('light');
      const spySaveTheme = spyOn(window.localStorage, 'setItem');

      const inputChangerTheme = fixture.debugElement.nativeElement.querySelector(
        'input'
      ) as HTMLInputElement;
      expect(inputChangerTheme).withContext('Deve capturar o elemento corretamente').toBeDefined();

      const eventStub = new Event('change');
      inputChangerTheme.dispatchEvent(eventStub);

      expect(spySaveTheme).toHaveBeenCalledTimes(1);
      expect(spySaveTheme).toHaveBeenCalledWith('fk-theme', 'dark');
    });

    it('deve trocar o tema para DARK quando o checkbox for clicado e estive em LIGHT', () => {
      spyOn(window.localStorage, 'getItem').and.returnValues('dark');
      const spySaveTheme = spyOn(window.localStorage, 'setItem');

      const inputChangerTheme = fixture.debugElement.nativeElement.querySelector(
        'input'
      ) as HTMLInputElement;
      expect(inputChangerTheme).withContext('Deve capturar o elemento corretamente').toBeDefined();

      const eventStub = new Event('change');
      inputChangerTheme.dispatchEvent(eventStub);

      expect(spySaveTheme).toHaveBeenCalledTimes(1);
      expect(spySaveTheme).toHaveBeenCalledWith('fk-theme', 'light');
    });
  });
});
