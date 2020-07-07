import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleButtonTestComponent } from './single-button-test.component';

describe('SingleButtonTestComponent', () => {
  let component: SingleButtonTestComponent;
  let fixture: ComponentFixture<SingleButtonTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleButtonTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleButtonTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
