import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaImoveisComponent } from './lista-imoveis.component';

describe('ListaImoveisComponent', () => {
  let component: ListaImoveisComponent;
  let fixture: ComponentFixture<ListaImoveisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaImoveisComponent]
    });
    fixture = TestBed.createComponent(ListaImoveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
