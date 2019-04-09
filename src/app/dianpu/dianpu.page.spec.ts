import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DianpuPage } from './dianpu.page';

describe('DianpuPage', () => {
  let component: DianpuPage;
  let fixture: ComponentFixture<DianpuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DianpuPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DianpuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
