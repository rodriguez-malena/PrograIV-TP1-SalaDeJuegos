import { TestBed } from '@angular/core/testing';

import { PartidaAhorcadoService } from './partida-ahorcado-service';

describe('PartidaAhorcadoService', () => {
  let service: PartidaAhorcadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartidaAhorcadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
