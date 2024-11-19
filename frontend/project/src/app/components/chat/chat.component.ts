import {Component, OnInit} from '@angular/core';
import { ChatService } from '../../services/chat/chat.service'
import {NgClass, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DataShareService} from "../../services/data-share/data-share.service";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  userMessage: string = '';
  messages: { text: string, isUser: boolean }[] = [];
  adicional: { id_obra?: number, id_cliente?: number } = {};


  constructor(private chatService: ChatService,
              private dataShareService: DataShareService) {}

  ngOnInit() {
    this.mensajesBienvenida();

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

  mensajesBienvenida():void {
    this.messages.push({text: '¡Hola! Soy tu asistente virtual, ¿En qué puedo ayudarte?', isUser: false});
    this.messages.push({text: 'Ingresá la opción deseada:', isUser: false});
    this.messages.push({text: '1- Recomendaciónes para presupuesto' +
        '2- Materiales frecuentes para cliente' +
        '3- Ofertas vigentes' +
        '4- Calcular costos adicionales' +
        '5- Seguimiento de obra' +
        '6- Sugerencias de optimización de costos' +
        '7- Evaluación de proveedores' +
        '8- Análisis de costos', isUser: false});
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
