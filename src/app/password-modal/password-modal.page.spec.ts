import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordModalPage } from './password-modal.page';

describe('PasswordModalPage', () => {
  let component: PasswordModalPage;
  let fixture: ComponentFixture<PasswordModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
