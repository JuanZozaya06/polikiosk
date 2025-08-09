import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicWaveComponent } from './mic-wave.component';

describe('MicWaveComponent', () => {
  let component: MicWaveComponent;
  let fixture: ComponentFixture<MicWaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicWaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicWaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
