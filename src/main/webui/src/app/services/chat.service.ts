import { Injectable, signal, computed } from '@angular/core';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'seen' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // Messages storage using signal for reactivity
  private _messages = signal<ChatMessage[]>([]);

  // Computed signal to get messages reactively
  public messages = computed(() => this._messages());

  // Bot response templates - would typically come from a backend
  private botResponses = [
    "Hello! How can I help you today?",
    "I'm here to assist with any questions you might have.",
    "Could you please provide more details?",
    "Let me check that for you...",
    "Thank you for your patience.",
    "Is there anything else you'd like to know?",
    "I understand your concern. Let me find a solution for you.",
    "That's a great question! Here's what I know...",
    "I apologize for any confusion caused.",
    "Feel free to ask if you have any other questions!"
  ];

  constructor() {
    // Initialize with a welcome message
    this.addBotMessage("Welcome! How can I assist you today?");
  }

  // Add a user message and trigger a bot response
  sendMessage(text: string): void {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    // Add user message
    this._messages.update(msgs => [...msgs, userMessage]);

    // Update status to sent after a short delay
    setTimeout(() => {
      this._messages.update(msgs =>
        msgs.map(m => m.id === userMessage.id ? {...m, status: 'sent'} : m)
      );
    }, 500);

    // Simulate bot thinking time and response
    setTimeout(() => {
      this.generateBotResponse();
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  }

  // Clear all messages
  clearChat(): void {
    this._messages.set([]);
    // Add a fresh welcome message
    this.addBotMessage("Chat history cleared. How can I help you?");
  }

  // Add a bot message directly (for welcome messages, etc.)
  private addBotMessage(text: string): void {
    const botMessage: ChatMessage = {
      id: Date.now(),
      text: text,
      sender: 'bot',
      timestamp: new Date()
    };

    this._messages.update(msgs => [...msgs, botMessage]);
  }

  // Generate a bot response based on the conversation context
  private generateBotResponse(): void {
    // In a real app, this would use NLP, context awareness, etc.
    // For this demo, we'll just use a random response

    const randomIndex = Math.floor(Math.random() * this.botResponses.length);
    const responseText = this.botResponses[randomIndex];

    this.addBotMessage(responseText);
  }
}
