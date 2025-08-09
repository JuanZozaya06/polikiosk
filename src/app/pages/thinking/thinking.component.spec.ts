import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThinkingComponent } from './thinking.component';

describe('ThinkingComponent', () => {
  let component: ThinkingComponent;
  let fixture: ComponentFixture<ThinkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThinkingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
