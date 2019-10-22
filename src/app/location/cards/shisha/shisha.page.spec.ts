import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShishaPage } from './shisha.page';

describe('ShishaPage', () => {
  let component: ShishaPage;
  let fixture: ComponentFixture<ShishaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShishaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShishaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
