import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CompartilhadosModule } from '../../compartilhados/compartilhados.module';

import { PainelAdminComponent } from './painel-admin/painel-admin.component';
import { AprovarImoveisComponent } from './aprovar-imoveis/aprovar-imoveis.component';
import { GestaoUtilizadoresComponent } from './gestao-utilizadores/gestao-utilizadores.component';
import { CriarUtilizadorComponent } from './criar-utilizador/criar-utilizador.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';

@NgModule({
  declarations: [
    PainelAdminComponent,
    AprovarImoveisComponent,
    GestaoUtilizadoresComponent,
    CriarUtilizadorComponent,
    RelatoriosComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CompartilhadosModule
  ],
  exports: [
    PainelAdminComponent,
    AprovarImoveisComponent
  ]
})
export class AdministradorModule { }