import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacoesRecebidasComponent } from './solicitacoes-recebidas.component';

describe('SolicitacoesRecebidasComponent', () => {
  let component: SolicitacoesRecebidasComponent;
  let fixture: ComponentFixture<SolicitacoesRecebidasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitacoesRecebidasComponent]
    });
    fixture = TestBed.createComponent(SolicitacoesRecebidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
