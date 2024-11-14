import {Component, OnInit} from '@angular/core';
import { ChatService } from '../../services/chat/chat.service'
import {NgClass, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";

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

  constructor(private chatService: ChatService) {}

  NgOnInit(){
    this.mensajesBienvenida()
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
      this.chatService.getResponse(this.userMessage).subscribe((response) => {
        this.messages.push({ text: response.message, isUser: false });
      });
      this.userMessage = '';  // Limpiar el input
    }
  }

  ngOnInit(): void {
  }
}
