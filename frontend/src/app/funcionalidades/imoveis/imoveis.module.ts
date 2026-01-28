import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CompartilhadosModule } from '../../compartilhados/compartilhados.module';

import { ListaImoveisComponent } from './lista-imoveis/lista-imoveis.component';
import { DetalhesImovelComponent } from './detalhes-imovel/detalhes-imovel.component';
import { CriarImovelComponent } from './criar-imovel/criar-imovel.component';
import { EditarImovelComponent } from './editar-imovel/editar-imovel.component';

@NgModule({
  declarations: [
    ListaImoveisComponent,
    DetalhesImovelComponent,
    CriarImovelComponent,
    EditarImovelComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CompartilhadosModule
  ],
  exports: [
    ListaImoveisComponent,
    DetalhesImovelComponent,
    CriarImovelComponent,
    EditarImovelComponent
  ]
})
export class ImoveisModule { }