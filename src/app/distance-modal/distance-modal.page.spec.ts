import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceModalPage } from './distance-modal.page';

describe('DistanceModalPage', () => {
  let component: DistanceModalPage;
  let fixture: ComponentFixture<DistanceModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistanceModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistanceModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
