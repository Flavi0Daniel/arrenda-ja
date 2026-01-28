import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelArrendatarioComponent } from './painel-arrendatario.component';

describe('PainelArrendatarioComponent', () => {
  let component: PainelArrendatarioComponent;
  let fixture: ComponentFixture<PainelArrendatarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PainelArrendatarioComponent]
    });
    fixture = TestBed.createComponent(PainelArrendatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
