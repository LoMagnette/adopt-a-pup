import {Injectable, signal, computed, inject} from '@angular/core';
import {ChatMessage} from "../models/chat-message";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class ChatService {
    // Messages storage using signal for reactivity
    private _messages = signal<ChatMessage<any>[]>([]);

    // Computed signal to get messages reactively
    public messages = this._messages.asReadonly();

    private http = inject(HttpClient);


    constructor() {
        // Initialize with a welcome message
        this.addBotMessage("Welcome! How can I assist you today?");
    }

    // Add a user message and trigger a bot response
    sendMessage(text: string, files: File[]) {
        this.addUserMessage(text);
        return this.http.post<ChatMessage<any>>('/api/bot', {text}).pipe(tap(response => {
                this.addBotMessage(response.text);
            })
        );

    }

    addBotMessage(text: string): void {
        this._messages.set([
            ...this.messages(),
            {
                text,
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
    }

    addUserMessage(text: string): void {
        this._messages.set([
            ...this.messages(),
            {
                text,
                sender: 'user',
                timestamp: new Date()
            }
        ]);
    }
}
