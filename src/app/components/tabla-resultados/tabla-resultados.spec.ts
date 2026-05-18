import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResultados } from './tabla-resultados';

describe('TablaResultados', () => {
  let component: TablaResultados;
  let fixture: ComponentFixture<TablaResultados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaResultados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaResultados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
