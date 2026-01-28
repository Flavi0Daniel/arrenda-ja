import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasSolicitacoesComponent } from './minhas-solicitacoes.component';

describe('MinhasSolicitacoesComponent', () => {
  let component: MinhasSolicitacoesComponent;
  let fixture: ComponentFixture<MinhasSolicitacoesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinhasSolicitacoesComponent]
    });
    fixture = TestBed.createComponent(MinhasSolicitacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
