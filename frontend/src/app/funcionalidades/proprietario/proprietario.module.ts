import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CompartilhadosModule } from '../../compartilhados/compartilhados.module';

import { PainelProprietarioComponent } from './painel-proprietario/painel-proprietario.component';
import { MeusImoveisComponent } from './meus-imoveis/meus-imoveis.component';
import { SolicitacoesRecebidasComponent } from './solicitacoes-recebidas/solicitacoes-recebidas.component';

@NgModule({
  declarations: [
    PainelProprietarioComponent,
    MeusImoveisComponent,
    SolicitacoesRecebidasComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CompartilhadosModule
  ],
  exports: [
    PainelProprietarioComponent,
    MeusImoveisComponent,
    SolicitacoesRecebidasComponent
  ]
})
export class ProprietarioModule { }