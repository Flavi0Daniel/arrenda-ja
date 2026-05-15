import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  
import { RouterModule } from '@angular/router';

import { MeuPerfilComponent } from './meu-perfil/meu-perfil.component';
import { AlterarSenhaComponent } from './alterar-senha/alterar-senha.component';



@NgModule({
  declarations: [
    MeuPerfilComponent,
    AlterarSenhaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,  
    RouterModule
  ],
  exports: [
    MeuPerfilComponent,
    AlterarSenhaComponent
  ]
})
export class PerfilModule { }
