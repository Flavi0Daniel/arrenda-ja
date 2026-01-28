import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelProprietarioComponent } from './painel-proprietario.component';

describe('PainelProprietarioComponent', () => {
  let component: PainelProprietarioComponent;
  let fixture: ComponentFixture<PainelProprietarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PainelProprietarioComponent]
    });
    fixture = TestBed.createComponent(PainelProprietarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
