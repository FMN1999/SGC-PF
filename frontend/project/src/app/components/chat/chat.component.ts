import {Component, Input, OnInit} from '@angular/core';
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
  @Input() modo: string = 'presupuesto';


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
    this.chatService.getMensajeBienvenida(this.modo).subscribe((response) => {
      this.receiveMessage(response);
    });
  }

  sendMessage() {
    if (this.userMessage.trim()) {
      this.messages.push({ text: this.userMessage, isUser: true });
      this.chatService.getResponse(this.userMessage, this.adicional, this.modo).subscribe((response) => {
        this.receiveMessage(response);
      });
      this.userMessage = ''; // Limpiar el input
    }
  }

  receiveMessage(response: any) {
    this.messages.push({ text: response.message, isUser: false });
  }

  setAdicionalData(adicionalData: { id_obra?: number, id_cliente?: number }) {
    this.adicional = adicionalData;
  }
}
