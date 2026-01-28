import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Imovel } from '../../../modelos/imovel.model';
import { ImovelService } from '../../../servicos/imovel.service';

@Component({
  selector: 'app-cartao-imovel',
  templateUrl: './cartao-imovel.component.html',
  styleUrls: ['./cartao-imovel.component.css']
})
export class CartaoImovelComponent {
  @Input() imovel!: Imovel;

  constructor(
    private imovelService: ImovelService,
    private router: Router
  ) {}

  obterUrlFoto(caminho: string): string {
    return this.imovelService.obterUrlFoto(caminho);
  }

  verDetalhes(): void {
    this.router.navigate(['/imoveis', this.imovel.id]);
  }

  formatarPreco(preco: number): string {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(preco);
  }
}