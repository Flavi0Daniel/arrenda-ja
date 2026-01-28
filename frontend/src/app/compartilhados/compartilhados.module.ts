import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { CabecalhoComponent } from './componentes/cabecalho/cabecalho.component';
import { RodapeComponent } from './componentes/rodape/rodape.component';
import { CartaoImovelComponent } from './componentes/cartao-imovel/cartao-imovel.component';
import { CarregamentoComponent } from './componentes/carregamento/carregamento.component';



@NgModule({
  declarations: [
    CabecalhoComponent,
    RodapeComponent,
    CartaoImovelComponent,
    CarregamentoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    CabecalhoComponent,
    RodapeComponent,
    CartaoImovelComponent,
    CarregamentoComponent,
    // Exportar também os módulos para que outros possam usar
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CompartilhadosModule { }
