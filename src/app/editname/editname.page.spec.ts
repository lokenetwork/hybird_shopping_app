import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditnamePage } from './editname.page';

describe('EditnamePage', () => {
  let component: EditnamePage;
  let fixture: ComponentFixture<EditnamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditnamePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditnamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
