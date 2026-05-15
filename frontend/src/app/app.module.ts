import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Módulos customizados
import { CompartilhadosModule } from './compartilhados/compartilhados.module';
import { AutenticacaoModule } from './funcionalidades/autenticacao/autenticacao.module';
import { InicioModule } from './funcionalidades/inicio/inicio.module';
import { ImoveisModule } from './funcionalidades/imoveis/imoveis.module';
import { ProprietarioModule } from './funcionalidades/proprietario/proprietario.module';
import { ArrendatarioModule } from './funcionalidades/arrendatario/arrendatario.module';
import { AdministradorModule } from './funcionalidades/administrador/administrador.module';
import { MensagensModule } from './funcionalidades/mensagens/mensagens.module'; 
import { PerfilModule } from './funcionalidades/perfil/perfil.module';




// Interceptors
import { autenticacaoInterceptor } from './nucleos/interceptors/autenticacao.interceptor';
import { erroInterceptor } from './nucleos/interceptors/erro.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CompartilhadosModule,
    AutenticacaoModule,
    InicioModule,
    ImoveisModule,
    ProprietarioModule,
    ArrendatarioModule,
    AdministradorModule,
    MensagensModule,
    PerfilModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors([autenticacaoInterceptor, erroInterceptor])
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }