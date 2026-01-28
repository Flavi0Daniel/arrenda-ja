import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { PaginaInicialComponent } from './funcionalidades/inicio/pagina-inicial/pagina-inicial.component';
import { EntrarComponent } from './funcionalidades/autenticacao/entrar/entrar.component';
import { RegistarComponent } from './funcionalidades/autenticacao/registar/registar.component';
import { ListaImoveisComponent } from './funcionalidades/imoveis/lista-imoveis/lista-imoveis.component';
import { DetalhesImovelComponent } from './funcionalidades/imoveis/detalhes-imovel/detalhes-imovel.component';
import { CriarImovelComponent } from './funcionalidades/imoveis/criar-imovel/criar-imovel.component';

// Proprietário
import { PainelProprietarioComponent } from './funcionalidades/proprietario/painel-proprietario/painel-proprietario.component';
import { MeusImoveisComponent } from './funcionalidades/proprietario/meus-imoveis/meus-imoveis.component';
import { SolicitacoesRecebidasComponent } from './funcionalidades/proprietario/solicitacoes-recebidas/solicitacoes-recebidas.component';

// Arrendatário
import { PainelArrendatarioComponent } from './funcionalidades/arrendatario/painel-arrendatario/painel-arrendatario.component';
import { MinhasSolicitacoesComponent } from './funcionalidades/arrendatario/minhas-solicitacoes/minhas-solicitacoes.component';



// Guards
import { autenticacaoGuard } from './nucleos/guards/autenticacao.guard';
import { proprietarioGuard } from './nucleos/guards/proprietario.guard';
import { arrendatarioGuard } from './nucleos/guards/arrendatario.guard';



const routes: Routes = [

  // Página inicial
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: PaginaInicialComponent },
  
  // Autenticação
  { path: 'entrar', component: EntrarComponent },
  { path: 'registar', component: RegistarComponent },

  // Imóveis
  { path: 'imoveis', component: ListaImoveisComponent },
  { path: 'imoveis/:id', component: DetalhesImovelComponent },

  // Proprietário (Rotas Protegidas)
  { 
    path: 'proprietario/painel', 
    component: PainelProprietarioComponent,
    canActivate: [autenticacaoGuard, proprietarioGuard]
  },

  { 
    path: 'proprietario/criar-imovel', 
    component: CriarImovelComponent,
    canActivate: [autenticacaoGuard, proprietarioGuard]
  },

  { 
    path: 'proprietario/meus-imoveis', 
    component: MeusImoveisComponent,
    canActivate: [autenticacaoGuard, proprietarioGuard]
  },
  { 
    path: 'proprietario/solicitacoes', 
    component: SolicitacoesRecebidasComponent,
    canActivate: [autenticacaoGuard, proprietarioGuard]
  },


  // Arrendatário (Rotas Protegidas)
  { 
    path: 'arrendatario/painel', 
    component: PainelArrendatarioComponent,
    canActivate: [autenticacaoGuard, arrendatarioGuard]
  },
  { 
    path: 'arrendatario/solicitacoes', 
    component: MinhasSolicitacoesComponent,
    canActivate: [autenticacaoGuard, arrendatarioGuard]
  },
  
  
  // Rota 404 (deve ser a última)
  { path: '**', redirectTo: '/inicio' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
