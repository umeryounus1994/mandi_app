import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnacksPage } from './snacks.page';

describe('SnacksPage', () => {
  let component: SnacksPage;
  let fixture: ComponentFixture<SnacksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnacksPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnacksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
