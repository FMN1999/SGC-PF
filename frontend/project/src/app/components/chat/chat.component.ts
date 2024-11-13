import { Component } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service'
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  query: string = '';
  resultados: any[] = [];

  constructor(private chatService: ChatService) {}

  onBuscar(): void {
    this.chatService.buscarMaterialServicio(this.query).subscribe((res) => {
      this.resultados = res;
    });
  }

  onAgregar(materialServicio: any): void {
    // Lógica para agregar a LineaCompra o Servicios elegidos
  }
}
