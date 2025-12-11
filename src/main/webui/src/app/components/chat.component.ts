import {Component, effect, ElementRef, inject, signal, viewChild, ChangeDetectionStrategy} from '@angular/core';

import {FormsModule} from '@angular/forms';
import {ChatService} from "../services/chat.service";
import {Router} from "@angular/router";
import {MarkdownComponent} from "ngx-markdown";
import {AudioRecorderService} from "../services/audio-recorder.service";
import {AnimationState, DogAnimationComponent} from "./dog-animation.component";


@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [FormsModule, MarkdownComponent, DogAnimationComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="chat-container" [class.minimized]="isMinimized()">
            @if (!isMinimized()) {
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
                                <p>
                                    <markdown>{{ message.text }}</markdown>
                                </p>
                                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
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
                        @if (isRecording()) {
                            <button class="attachment-button" (click)="toggleRecording()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     viewBox="0 0 16 16">
                                    <path d="M4.121 0a1 1 0 0 0-.707.293L.293 3.414A1 1 0 0 0 0 4.121v7.758a1 1 0 0 0 .293.707l3.121 3.121a1 1 0 0 0 .707.293h7.758a1 1 0 0 0 .707-.293l3.121-3.121a1 1 0 0 0 .293-.707V4.121a1 1 0 0 0-.293-.707L12.879.293A1 1 0 0 0 12.172 0H4.121zM5 5h6v6H5V5z"/>
                                </svg>
                            </button>
                        } @else {
                            <button class="attachment-button" (click)="toggleRecording()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     viewBox="0 0 16 16">
                                    <path d="M1.5 8a.5.5 0 0 1 .5-.5h1v1h-1a.5.5 0 0 1-.5-.5zm2.5-2a.5.5 0 0 1 .5-.5h1v5h-1a.5.5 0 0 1-.5-.5V6zm3-3a.5.5 0 0 1 .5-.5h1v11h-1a.5.5 0 0 1-.5-.5V3zm3 2a.5.5 0 0 1 .5-.5h1v7h-1a.5.5 0 0 1-.5-.5V5zm3 2a.5.5 0 0 1 .5-.5h1v3h-1a.5.5 0 0 1-.5-.5V7z"/>
                                </svg>
                            </button>
                        }
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

                @if (audio()) {
                    <div class="selected-file">
                        <button (click)="download()">⬇️ Download Recording</button>
                    </div>
                }
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
        <app-dog-animation (talkingChange)="toggleMinimize()" [state]="dogState()"></app-dog-animation>
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
        width: 600px;
        height: 650px;
        border-radius: 24px;
        overflow: visible;
        box-shadow: 0 10px 40px rgba(99, 102, 241, 0.2);
        background: linear-gradient(to bottom, #ffffff, #fafbff);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        border: 1px solid rgba(99, 102, 241, 0.1);
      }

      .chat-container::before {
        content: '';
        position: absolute;
        bottom: -15px;
        right: 135px;
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-top: 15px solid #fafbff;
      }

      .chat-container::after {
        content: '';
        position: absolute;
        bottom: -19px;
        right: 132px;
        width: 0;
        height: 0;
        border-left: 18px solid transparent;
        border-right: 18px solid transparent;
        border-top: 19px solid rgba(99, 102, 241, 0.15);
        z-index: -1;
      }

      .message-content img {
        max-width: 150px;
      }

      .chat-container.minimized {
        width: auto;
        height: auto;
        background-color: transparent;
        box-shadow: none;
      }

      .chat-container.minimized::before,
      .chat-container.minimized::after {
        display: none;
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
        background: linear-gradient(135deg, #6e8efb, #a777e3);
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
        padding: 24px;
        overflow-y: auto;
        background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%);
        display: flex;
        flex-direction: column;
        gap: 16px;
        border-radius: 15px;
      }

      .chat-messages::-webkit-scrollbar {
        width: 6px;
      }

      .chat-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      .chat-messages::-webkit-scrollbar-thumb {
        background: rgba(99, 102, 241, 0.2);
        border-radius: 3px;
      }

      .chat-messages::-webkit-scrollbar-thumb:hover {
        background: rgba(99, 102, 241, 0.3);
      }

      .empty-chat {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #9ca3af;
        font-style: italic;
        font-size: 0.95rem;
      }

      .message {
        max-width: 80%;
        min-width: 120px;
        padding: 6px 10px;
        border-radius: 12px;
        position: relative;
        line-height: 1.4;
        animation: messageSlideIn 0.3s ease-out;
      }

      @keyframes messageSlideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .message-content {
        position: relative;
      }

      .message-content p {
        margin: 0;
        padding-bottom: 2px;
        word-wrap: break-word;
      }

      .message-time {
        position: absolute;
        bottom: 2px;
        right: 4px;
        font-size: 10px;
        color: rgba(0, 0, 0, 0.4);
        padding: 0;
        font-weight: 500;
      }

      .user-message {
        align-self: flex-end;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #ffffff !important;
        border-bottom-right-radius: 6px;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
      }

      .user-message .message-time {
        color: rgba(255, 255, 255, 0.9) !important;
      }

      .user-message .message-content {
        color: #ffffff !important;
      }

      .user-message .message-content p {
        color: #ffffff !important;
      }

      .user-message markdown {
        color: #ffffff !important;
      }

      .user-message markdown * {
        color: #ffffff !important;
      }

      .user-message ::ng-deep markdown,
      .user-message ::ng-deep markdown *,
      .user-message ::ng-deep p,
      .user-message ::ng-deep span,
      .user-message ::ng-deep div {
        color: #ffffff !important;
      }

      .bot-message {
        align-self: flex-start;
        background-color: #ffffff;
        border-bottom-left-radius: 6px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(99, 102, 241, 0.1);
        color: var(--text-primary);
      }

      .bot-message .message-content p {
        color: var(--text-primary);
      }

      .chat-input {
        display: flex;
        padding: 20px;
        background: linear-gradient(to top, #ffffff, #fafbff);
        border-top: 1px solid rgba(99, 102, 241, 0.1);
        border-radius: 15px;
      }

      .input-container {
        display: flex;
        align-items: center;
        flex: 1;
        border: 2px solid rgba(99, 102, 241, 0.15);
        border-radius: 28px;
        padding: 0 18px;
        background-color: #ffffff;
        transition: all 0.2s ease;
      }

      .input-container:focus-within {
        border-color: rgba(99, 102, 241, 0.4);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }

      .input-container input {
        flex: 1;
        padding: 14px 8px;
        border: none;
        outline: none;
        font-size: 15px;
        background-color: transparent;
        color: var(--text-primary);
      }

      .input-container input::placeholder {
        color: #9ca3af;
      }

      .attachment-button {
        background: transparent;
        border: none;
        color: #6366f1;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .attachment-button:hover {
        background-color: rgba(99, 102, 241, 0.1);
        color: #4f46e5;
        transform: scale(1.1);
      }

      .send-button {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        margin-left: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      }

      .send-button:hover:not(:disabled) {
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
      }

      .send-button:active:not(:disabled) {
        transform: translateY(0);
      }

      .send-button:disabled {
        background: #d1d5db;
        cursor: not-allowed;
        box-shadow: none;
      }

      .selected-files {
        padding: 12px 20px;
        background: linear-gradient(to bottom, #f0f5ff, #fafbff);
        border-top: 1px solid rgba(99, 102, 241, 0.1);
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .selected-file {
        display: flex;
        align-items: center;
        background: linear-gradient(135deg, #e0e7ff, #ddd6fe);
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 13px;
        font-weight: 500;
        color: var(--primary-color);
        box-shadow: 0 2px 4px rgba(99, 102, 241, 0.1);
        transition: all 0.2s ease;
      }

      .selected-file:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(99, 102, 241, 0.15);
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
        color: #6366f1;
        cursor: pointer;
        padding: 4px;
        margin-left: 6px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .remove-file:hover {
        background-color: rgba(99, 102, 241, 0.2);
        transform: scale(1.1);
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
        padding: 0.10rem 1rem;
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
    router = inject(Router);
    audioRecorder = inject(AudioRecorderService);

    isMinimized = signal<boolean>(true); // Start minimized as a FAB
    isOnline = signal<boolean>(true);
    messages = this.chatService.messages;
    currentMessage = signal<string>('');
    selectedFiles = signal<File[]>([]);
    isTyping = signal(false);
    isRecording = this.audioRecorder.isRecording;
    audio = this.audioRecorder.audio;
    dogState = signal<AnimationState>('running');

    readonly chatMessagesEl = viewChild.required<ElementRef>('chatMessages');
    readonly fileInput = viewChild.required<ElementRef>('fileInput');


    constructor() {
        effect(() => {
            const _ = this.messages();
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
        if (!this.currentMessage() && this.selectedFiles().length === 0 && !this.audioRecorder.audioFile()) return;
        this.isTyping.set(true);
        const message = this.currentMessage();
        this.currentMessage.set('');
        const route = this.router.url;
        const files = this.selectedFiles();
        this.selectedFiles.set([]);
        this.dogState.set('thinking');
        console.log("switching state");
        this.chatService.sendMessage(message, files, this.audioRecorder.audioFile()).subscribe(value => {
                //TODO
                this.scrollToBottom();
                this.isTyping.set(false);
                if (value.category) {
                    if ((route === "" && value.category !== 'COMPANY') ||
                        (route.includes("puppies") && value.category !== 'PUPPY') ||
                        (!route.includes("puppies") && value.category === 'PUPPY') ||
                        (route.includes("adopt") && value.category !== 'ADOPTION') ||
                        (!route.includes("adopt") && value.category === 'ADOPTION')) {

                        this.router.navigate([this.getRoute(value.category)]);
                    }

                }

                const position = route.includes('adopt') ? 'rolling': 'standing';
            console.log("route", route, position);
                this.dogState.set(position);
            }
        )
    }


    private getRoute(category: string) {
        switch (category) {
            case "PUPPY":
                return "/puppies";
            case "ADOPTION":
                return "/adopt";
            default:
                return "/";
        }
    }

    // Scroll to the bottom of the chat
    scrollToBottom(): void {
        const chatMessagesEl = this.chatMessagesEl();
        if (chatMessagesEl && chatMessagesEl.nativeElement) {
            chatMessagesEl.nativeElement.scrollTop = chatMessagesEl.nativeElement.scrollHeight;
        }
    }

    // Format timestamp for display
    formatTime(date: Date): string {
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }

    toggleRecording(): void {
        this.audioRecorder.toggle()
    }

    download() {
        const blob = this.audioRecorder.audioFile();
        if (!blob) {
            console.warn('No audio blob available to download');
            return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording.webm';
        a.click();
        URL.revokeObjectURL(url);
    }
}
