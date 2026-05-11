import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhorcadoComponent } from './ahorcado-component';

describe('AhorcadoComponent', () => {
  let component: AhorcadoComponent;
  let fixture: ComponentFixture<AhorcadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AhorcadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AhorcadoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
