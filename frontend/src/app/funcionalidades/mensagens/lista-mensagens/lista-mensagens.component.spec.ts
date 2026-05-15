import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMensagensComponent } from './lista-mensagens.component';

describe('ListaMensagensComponent', () => {
  let component: ListaMensagensComponent;
  let fixture: ComponentFixture<ListaMensagensComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaMensagensComponent]
    });
    fixture = TestBed.createComponent(ListaMensagensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
