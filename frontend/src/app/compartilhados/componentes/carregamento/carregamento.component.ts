import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carregamento',
  templateUrl: './carregamento.component.html',
  styleUrls: ['./carregamento.component.css']
})
export class CarregamentoComponent {

  @Input() mensagem: string = 'A carregar...';
  @Input() tamanho: 'small' | 'medium' | 'large' = 'medium';

}
