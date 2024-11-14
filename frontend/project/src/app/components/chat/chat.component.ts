import { Component } from '@angular/core';
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
export class ChatComponent {
  userMessage: string = '';
  messages: { text: string, isUser: boolean }[] = [];

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (this.userMessage.trim()) {
      this.messages.push({ text: this.userMessage, isUser: true });
      this.chatService.getResponse(this.userMessage).subscribe((response) => {
        this.messages.push({ text: response.message, isUser: false });
      });
      this.userMessage = '';  // Limpiar el input
    }
  }
}
