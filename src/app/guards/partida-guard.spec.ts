import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';
import { AhorcadoComponent } from '../juegos/ahorcado/ahorcado-component/ahorcado-component';
import { partidaGuard } from './partida-guard';

describe('partidaGuard', () => {
  const executeGuard: CanDeactivateFn<AhorcadoComponent> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => partidaGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
