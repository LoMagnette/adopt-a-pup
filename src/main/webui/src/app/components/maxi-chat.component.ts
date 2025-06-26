// app/pages/chat/chat.component.ts
import {Component, inject, signal, ViewChild, ElementRef, AfterViewChecked} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ChatService} from "../services/chat.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-maxi-chat',
    standalone: true,
    imports: [FormsModule],
    template: `
        <div class="chat-container">
            <div class="chat-header">
                <h3>Adopt a puppy with our agent</h3>
                <div class="status-indicator">
                    <span class="status-dot"></span>
                    Online
                </div>
            </div>

            <div class="messages-container" #messagesContainer>
                @for (message of chatService.messages(); track $index) {
                    <div class="message-wrapper" [class]="message.sender">
                        <div class="message">
                            <div class="message-content">{{ message.text }}</div>
                            @if (message.htmlContent) {
                                <div [innerHTML]="printHtml(message.htmlContent)"></div>
                            }
                            <div class="message-time">
                                {{ formatTime(message.timestamp) }}
                            </div>
                        </div>
                    </div>
                }

                @if (isTyping()) {
                    <div class="message-wrapper agent">
                        <div class="message typing">
                            <div class="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div class="input-container">
                <div class="input-wrapper">
                    <input
                            type="text"
                            [(ngModel)]="messageInput"
                            (keyup.enter)="sendMessage()"
                            placeholder="Type your message..."
                            class="message-input"
                            [disabled]="isTyping()"
                    >
                    <button
                            (click)="sendMessage()"
                            class="send-button"
                            [disabled]="!messageInput.trim() || isTyping()"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [`
      .chat-container {
        height: 80vh;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        background: white;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
        overflow: scroll;
      }

      .chat-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chat-header h3 {
        margin: 0;
        font-weight: 600;
      }

      .status-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
      }

      .status-dot {
        width: 10px;
        height: 10px;
        background: #4ade80;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          opacity: 1;
        }
      }

      .messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        background: #f8fafc;
      }

      .message-wrapper {
        display: flex;
        margin-bottom: 1rem;
      }

      .message-wrapper.user {
        justify-content: flex-end;
      }

      .message-wrapper.agent {
        justify-content: flex-start;
      }

      .message {
        max-width: 70%;
        padding: 0.75rem 1rem;
        border-radius: 18px;
        position: relative;
      }

      .message-wrapper.user .message {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-bottom-right-radius: 4px;
      }

      .message-wrapper.agent .message {
        background: white;
        color: #374151;
        border: 1px solid #e5e7eb;
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .message-content {
        margin-bottom: 0.25rem;
        line-height: 1.4;
      }

      .message-time {
        font-size: 0.75rem;
        opacity: 0.7;
      }

      .typing {
        padding: 1rem !important;
      }

      .typing-indicator {
        display: flex;
        gap: 4px;
        align-items: center;
      }

      .typing-indicator span {
        width: 8px;
        height: 8px;
        background: #9ca3af;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
      }

      .typing-indicator span:nth-child(1) {
        animation-delay: -0.32s;
      }

      .typing-indicator span:nth-child(2) {
        animation-delay: -0.16s;
      }

      @keyframes typing {
        0%, 80%, 100% {
          transform: scale(0);
          opacity: 0.5;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }

      .input-container {
        padding: 1.5rem;
        background: white;
        border-top: 1px solid #e5e7eb;
      }

      .input-wrapper {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .message-input {
        flex: 1;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 25px;
        outline: none;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }

      .message-input:focus {
        border-color: #667eea;
      }

      .message-input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .send-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        width: 45px;
        height: 45px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
      }

      .send-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }

      .send-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
    `]
})
export class MaxiChatComponent implements AfterViewChecked {
    @ViewChild('messagesContainer') messagesContainer!: ElementRef;

    chatService = inject(ChatService);
    domSanitizer = inject(DomSanitizer)
    messageInput = '';
    isTyping = signal(false);

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    printHtml(html: string) {
        return this.domSanitizer.bypassSecurityTrustHtml(html)
    }

    sendMessage() {
        if (!this.messageInput.trim() || this.isTyping()) return;

        const message = this.messageInput.trim();
        this.messageInput = '';
        this.isTyping.set(true);

        this.chatService.sendMessage(message, [], null).subscribe(() => {
            this.isTyping.set(false);
        });
    }

    formatTime(timestamp: Date): string {
        return timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    private scrollToBottom() {
        if (this.messagesContainer) {
            const element = this.messagesContainer.nativeElement;
            element.scrollTop = element.scrollHeight;
        }
    }
}