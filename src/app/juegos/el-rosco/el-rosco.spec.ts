import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElRosco } from './el-rosco';

describe('ElRosco', () => {
  let component: ElRosco;
  let fixture: ComponentFixture<ElRosco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElRosco]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElRosco);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
