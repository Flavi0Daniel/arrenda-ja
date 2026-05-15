import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ListaMensagensComponent } from './lista-mensagens/lista-mensagens.component';
import { ConversaComponent } from './conversa/conversa.component';

@NgModule({
  declarations: [
    ListaMensagensComponent,
    ConversaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    ListaMensagensComponent,
    ConversaComponent
  ]
})
export class MensagensModule { }