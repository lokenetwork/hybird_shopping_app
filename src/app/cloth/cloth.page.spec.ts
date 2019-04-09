import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClothPage } from './cloth.page';

describe('ClothPage', () => {
  let component: ClothPage;
  let fixture: ComponentFixture<ClothPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClothPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClothPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
