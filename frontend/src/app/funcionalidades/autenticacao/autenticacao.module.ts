import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EntrarComponent } from './entrar/entrar.component';
import { RegistarComponent } from './registar/registar.component';

@NgModule({
  declarations: [
    EntrarComponent,
    RegistarComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    EntrarComponent,
    RegistarComponent
  ]
})
export class AutenticacaoModule { }