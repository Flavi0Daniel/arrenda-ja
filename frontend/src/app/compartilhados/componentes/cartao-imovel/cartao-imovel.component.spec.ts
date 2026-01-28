import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaoImovelComponent } from './cartao-imovel.component';

describe('CartaoImovelComponent', () => {
  let component: CartaoImovelComponent;
  let fixture: ComponentFixture<CartaoImovelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartaoImovelComponent]
    });
    fixture = TestBed.createComponent(CartaoImovelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
