import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoUtilizadoresComponent } from './gestao-utilizadores.component';

describe('GestaoUtilizadoresComponent', () => {
  let component: GestaoUtilizadoresComponent;
  let fixture: ComponentFixture<GestaoUtilizadoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestaoUtilizadoresComponent]
    });
    fixture = TestBed.createComponent(GestaoUtilizadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
