import {Component, OnInit} from '@angular/core';
import { ChatService } from '../../services/chat/chat.service'
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DataShareService} from "../../services/data-share/data-share.service";

import {MarkdownModule} from 'ngx-markdown';

@Component({
  selector: 'app-chat',
  imports: [
    NgForOf,
    NgClass,
    FormsModule,
    NgIf,
    MarkdownModule,
  ],
  templateUrl: './chat.component.html',
  standalone: true,
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  userMessage: string = '';
  messages: { text: string, isUser: boolean }[] = [];
  adicional: { id_obra?: number, id_cliente?: number } = {};
  isVisible: boolean = false;


  constructor(private chatService: ChatService,
              private dataShareService: DataShareService) {}

  ngOnInit() {
    this.mensajesBienvenida();

    this.dataShareService.isVisible$.subscribe((visible) => {
      this.isVisible = visible;
    });


    this.dataShareService.obraId$.subscribe((obraId) => {
      if (obraId) {
        this.adicional = { ...this.adicional, id_obra: obraId }; // Mantener el id_cliente existente
      }

    });

    this.dataShareService.clienteId$.subscribe((clienteId) => {
      if (clienteId) {
        this.adicional = { ...this.adicional, id_cliente: clienteId }; // Mantener el id_obra existente
      }
    });
  }

  toggleChat() {
    this.dataShareService.toggleVisibility();
  }

  mensajesBienvenida():void {
    this.messages.push({text: '¡Hola! Soy tu asistente virtual, ¿En qué puedo ayudarte?', isUser: false});
    this.messages.push({text: 'Ingresá la opción deseada:', isUser: false});
    this.messages.push({text: '1. Recomendaciones para presupuesto\n' +
        '2. Materiales frecuentes para cliente\n' +
        '3. Ofertas vigentes\n' +
        '4. Calcular costos adicionales\n' +
        '5. Seguimiento de obra\n' +
        '6. Sugerencias de optimización de costos\n' +
        '7. Evaluación de proveedores\n' +
        '8. Análisis de costos', isUser: false});
  }

  sendMessage() {
    if (this.userMessage.trim()) {
      this.messages.push({ text: this.userMessage, isUser: true });
      this.chatService.getResponse(this.userMessage, this.adicional).subscribe((response) => {
        this.messages.push({ text: response.message, isUser: false });
      });
      this.userMessage = ''; // Limpiar el input
    }
  }

  setAdicionalData(adicionalData: { id_obra?: number, id_cliente?: number }) {
    this.adicional = adicionalData;
  }


}
