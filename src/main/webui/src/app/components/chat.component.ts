import {Component, signal, computed, ViewChild, ElementRef, AfterViewInit, inject, effect} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ChatService} from "../services/chat.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {ActivatedRoute, Router} from "@angular/router";
import {map} from "rxjs";
import {MarkdownComponent} from "ngx-markdown";


@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule, MarkdownComponent],
    template: `
        <div class="chat-container" [class.minimized]="isMinimized()">
            @if (isMinimized()) {
                <!-- FAB style button when minimized -->
                <button class="fab-button" (click)="toggleMinimize()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                         viewBox="0 0 16 16">
                        <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    </svg>
                </button>
            } @else {
                <!-- Full chat interface when expanded -->
                        <!-- Chat header -->
                <div class="chat-header">
                    <div class="chat-title">
                        <div class="status-indicator" [class.online]="isOnline()"></div>
                        <h3>Chat Support</h3>
                    </div>
                    <div class="chat-controls">
                        <button class="minimize-button" (click)="toggleMinimize()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 viewBox="0 0 16 16">
                                <path d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Chat messages -->
                <div class="chat-messages" #chatMessages>
                    @if (messages().length === 0) {
                        <div class="empty-chat">
                            <p>No messages yet. Start a conversation!</p>
                        </div>
                    }
                    @for (message of messages(); track $index) {
                        <div class="message" [class.user-message]="message.sender === 'user'"
                             [class.bot-message]="message.sender === 'bot'">
                            <div class="message-content">
                                <markdown>{{ message.text }}</markdown>
                                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                            </div>
                        </div>
                    }
                </div>

                <!-- Chat input -->
                <div class="chat-input">
                    <div class="input-container">
                        <input
                                type="text"
                                [ngModel]="currentMessage()"
                                (ngModelChange)="currentMessage.set($event)"
                                placeholder="Type a message..."
                                (keyup.enter)="sendMessage()"
                        >

                        <!-- File attachment button -->
                        <button class="attachment-button" (click)="fileInput.click()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 viewBox="0 0 16 16">
                                <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
                            </svg>
                        </button>
                        <input
                                #fileInput
                                type="file"
                                multiple
                                style="display: none"
                                (change)="handleFileSelection($event)"
                        >
                    </div>

                    <!-- Send button -->
                    <button class="send-button" (click)="sendMessage()"
                            [disabled]="!currentMessage() && selectedFiles().length === 0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             viewBox="0 0 16 16">
                            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                        </svg>
                    </button>
                </div>

                <!-- Selected files preview -->
                @if (selectedFiles().length > 0) {
                    <div class="selected-files">
                        @for (file of selectedFiles(); track file.name) {
                            <div class="selected-file">
                                <span class="file-name">{{ file.name }}</span>
                                <button class="remove-file" (click)="removeFile(file)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
                                         viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                    </svg>
                                </button>
                            </div>
                        }
                    </div>
                }
            }
        </div>
    `,
    styles: [`
      :host {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
      }

      .chat-container {
        display: flex;
        flex-direction: column;
        width: 400px;
        height: 600px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        background-color: white;
        transition: all 0.3s ease;
      }

      .chat-container.minimized {
        width: auto;
        height: auto;
        background-color: transparent;
        box-shadow: none;
      }

      .fab-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #4a6fa5;
        color: white;
        border: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.3s ease, background-color 0.3s ease;
      }

      .fab-button:hover {
        transform: scale(1.05);
        background-color: #3d5d8a;
      }

      .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 24px;
        background-color: #4a6fa5;
        color: white;
      }

      .chat-title {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .chat-title h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
      }

      .status-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #ccc;
      }

      .status-indicator.online {
        background-color: #4CAF50;
      }

      .chat-controls {
        display: flex;
        gap: 12px;
      }

      .minimize-button {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
      }

      .minimize-button:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }

      .chat-messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        background-color: #f5f8fb;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .empty-chat {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #999;
        font-style: italic;
      }

      .message {
        max-width: 80%;
        padding: 14px 18px;
        border-radius: 18px;
        position: relative;
        line-height: 1.5;
        margin-bottom: 6px;
      }

      .message-content {
        position: relative;
      }

      .message-content p {
        margin: 0;
        padding-bottom: 20px; /* Space for timestamp */
      }

      .message-time {
        position: absolute;
        bottom: 0;
        right: 0;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.5);
        padding: 2px 5px;
      }

      .user-message {
        align-self: flex-end;
        background-color: #e3effd;
        border-bottom-right-radius: 5px;
      }

      .bot-message {
        align-self: flex-start;
        background-color: #ffffff;
        border-bottom-left-radius: 5px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .chat-input {
        display: flex;
        padding: 18px;
        background-color: white;
        border-top: 1px solid #e9e9e9;
      }

      .input-container {
        display: flex;
        align-items: center;
        flex: 1;
        border: 1px solid #ddd;
        border-radius: 24px;
        padding: 0 15px;
        background-color: #f9f9f9;
      }

      .input-container input {
        flex: 1;
        padding: 12px 0;
        border: none;
        outline: none;
        font-size: 15px;
        background-color: transparent;
      }

      .attachment-button {
        background: transparent;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: background-color 0.2s ease;
      }

      .attachment-button:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: #4a6fa5;
      }

      .send-button {
        background-color: #4a6fa5;
        color: white;
        border: none;
        border-radius: 50%;
        width: 46px;
        height: 46px;
        margin-left: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease;
      }

      .send-button:hover {
        background-color: #3d5d8a;
      }

      .send-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }

      .selected-files {
        padding: 10px 18px;
        background-color: #f0f5ff;
        border-top: 1px solid #e0e8f5;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .selected-file {
        display: flex;
        align-items: center;
        background-color: #e3effd;
        padding: 5px 10px;
        border-radius: 12px;
        font-size: 13px;
      }

      .file-name {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .remove-file {
        background: transparent;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 3px;
        margin-left: 5px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .remove-file:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }

      .attachment-list {
        margin-top: 8px;
        margin-bottom: 15px;
      }

      .attachment-item {
        display: flex;
        align-items: center;
        gap: 5px;
        background-color: rgba(0, 0, 0, 0.05);
        padding: 5px 10px;
        border-radius: 8px;
        margin-bottom: 5px;
        font-size: 13px;
      }

      @media (max-width: 576px) {
        .chat-container {
          width: 100%;
          height: 100%;
          bottom: 0;
          right: 0;
          border-radius: 0;
        }

        :host {
          bottom: 0;
          right: 0;
          width: 100%;
        }

        .fab-button {
          position: absolute;
          bottom: 20px;
          right: 20px;
        }
      }
    `],
})
export class ChatComponent {
    // State signals
    chatService = inject(ChatService);
    route = inject(ActivatedRoute);
    router = inject(Router);

    currentRoute = toSignal(this.route.url.pipe(
        map(([url]) => {
                const {path, parameters} = url;
                return path;
            }
        )));

    isMinimized = signal<boolean>(true); // Start minimized as a FAB
    isOnline = signal<boolean>(true);
    messages = this.chatService.messages;
    currentMessage = signal<string>('');
    selectedFiles = signal<File[]>([]);

    @ViewChild('chatMessages') chatMessagesEl!: ElementRef;
    @ViewChild('fileInput') fileInput!: ElementRef;


    constructor() {
        effect(() => {
            const message = this.messages();
            this.scrollToBottom();
        })
    }

    // Method to toggle chat minimized state
    toggleMinimize(): void {
        this.isMinimized.update(state => !state);

        // If opening the chat, scroll to bottom after a short delay to ensure UI is updated
        if (!this.isMinimized()) {
            setTimeout(() => this.scrollToBottom(), 300);
        }
    }

    // Method to handle file selection
    handleFileSelection(event: Event): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            const newFiles = Array.from(fileInput.files);
            this.selectedFiles.update(files => [...files, ...newFiles]);

            // Reset the file input value so the same file can be selected again if needed
            fileInput.value = '';
        }
    }

    // Method to remove a selected file
    removeFile(fileToRemove: File): void {
        this.selectedFiles.update(files =>
            files.filter(file => file !== fileToRemove)
        );
    }

    // Method to send a message
    sendMessage(): void {
        // Don't send if there's no message and no files
        if (!this.currentMessage() && this.selectedFiles().length === 0) return;
        const message = this.currentMessage();
        this.currentMessage.set('');
        this.chatService.sendMessage(message, this.selectedFiles()).subscribe(value => {
                //TODO
                this.scrollToBottom();
                if (value.category) {
                    if ((this.currentRoute() === "" && value.category !== 'COMPANY') ||
                        (this.currentRoute() === "puppies" && value.category !== 'PUPPY') ||
                        (this.currentRoute() === "adoption" && value.category !== 'ADOPTION')) {

                        this.router.navigate([this.getRoute(value.category)]);
                    }

                }
            }
        )
    }


    private getRoute(category: string) {
        var route = "/";
        switch (category) {
            case "PUPPY":
                return "/puppies";
            case "ADOPTION":
                return "/adoption";
            default:
                return "/";
        }
    }

    // Scroll to the bottom of the chat
    scrollToBottom(): void {
        if (this.chatMessagesEl && this.chatMessagesEl.nativeElement) {
            this.chatMessagesEl.nativeElement.scrollTop = this.chatMessagesEl.nativeElement.scrollHeight;
        }
    }

    // Format timestamp for display
    formatTime(date: Date): string {
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }
}
