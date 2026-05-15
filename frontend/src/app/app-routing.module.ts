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


// Importar componentes do administrador
import { PainelAdminComponent } from './funcionalidades/administrador/painel-admin/painel-admin.component';
import { AprovarImoveisComponent } from './funcionalidades/administrador/aprovar-imoveis/aprovar-imoveis.component';

// Importar componentes de mensagens
import { ListaMensagensComponent } from './funcionalidades/mensagens/lista-mensagens/lista-mensagens.component';
import { ConversaComponent } from './funcionalidades/mensagens/conversa/conversa.component';

import { MeuPerfilComponent } from './funcionalidades/perfil/meu-perfil/meu-perfil.component';

import { EditarImovelComponent } from './funcionalidades/imoveis/editar-imovel/editar-imovel.component';

import { RelatoriosComponent } from './funcionalidades/administrador/relatorios/relatorios.component';

// Guards
import { autenticacaoGuard } from './nucleos/guards/autenticacao.guard';
import { proprietarioGuard } from './nucleos/guards/proprietario.guard';
import { arrendatarioGuard } from './nucleos/guards/arrendatario.guard';
import { administradorGuard } from './nucleos/guards/administrador.guard';
import { GestaoUtilizadoresComponent } from './funcionalidades/administrador/gestao-utilizadores/gestao-utilizadores.component';


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

  // Administrador (Rotas Protegidas)
  { 
    path: 'administrador/painel', 
    component: PainelAdminComponent,
    canActivate: [autenticacaoGuard, administradorGuard]
  },
  { 
    path: 'administrador/aprovar-imoveis', 
    component: AprovarImoveisComponent,
    canActivate: [autenticacaoGuard, administradorGuard]
  },

  // Adicionar rota (depois de aprovar-imoveis)
  { 
    path: 'administrador/gestao-utilizadores', 
    component: GestaoUtilizadoresComponent,
    canActivate: [autenticacaoGuard, administradorGuard]
  },


  // Rota de mensagens
  { 
    path: 'mensagens', 
    component: ListaMensagensComponent,
    canActivate: [autenticacaoGuard]
  },
  { 
    path: 'mensagens/conversa/:id', 
    component: ConversaComponent,
    canActivate: [autenticacaoGuard]
  },

  // Rota para perfil
  {
    path: 'perfil',
    component: MeuPerfilComponent,
    canActivate: [autenticacaoGuard]
  },

  // Adicionar rota (depois de criar-imovel)
  { 
    path: 'proprietario/editar-imovel/:id', 
    component: EditarImovelComponent,
    canActivate: [autenticacaoGuard, proprietarioGuard]
  },

    // Adicionar rota (depois de gestao-utilizadores)
  { 
    path: 'administrador/relatorios', 
    component: RelatoriosComponent,
    canActivate: [autenticacaoGuard, administradorGuard]
  },
  
  
  // Rota 404 (deve ser a última)
  { path: '**', redirectTo: '/inicio' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
