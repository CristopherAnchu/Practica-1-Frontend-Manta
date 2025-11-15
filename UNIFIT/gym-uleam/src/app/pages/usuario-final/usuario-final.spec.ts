import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioFinal } from './usuario-final';

describe('UsuarioFinal', () => {
  let component: UsuarioFinal;
  let fixture: ComponentFixture<UsuarioFinal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioFinal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioFinal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
