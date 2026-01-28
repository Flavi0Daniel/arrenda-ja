import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CompartilhadosModule } from '../../compartilhados/compartilhados.module';

import { PainelArrendatarioComponent } from './painel-arrendatario/painel-arrendatario.component';
import { MinhasSolicitacoesComponent } from './minhas-solicitacoes/minhas-solicitacoes.component';

@NgModule({
  declarations: [
    PainelArrendatarioComponent,
    MinhasSolicitacoesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CompartilhadosModule
  ],
  exports: [
    PainelArrendatarioComponent,
    MinhasSolicitacoesComponent
  ]
})
export class ArrendatarioModule { }