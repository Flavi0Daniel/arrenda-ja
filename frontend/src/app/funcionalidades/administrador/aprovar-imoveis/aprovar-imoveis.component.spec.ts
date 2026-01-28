import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovarImoveisComponent } from './aprovar-imoveis.component';

describe('AprovarImoveisComponent', () => {
  let component: AprovarImoveisComponent;
  let fixture: ComponentFixture<AprovarImoveisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AprovarImoveisComponent]
    });
    fixture = TestBed.createComponent(AprovarImoveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
