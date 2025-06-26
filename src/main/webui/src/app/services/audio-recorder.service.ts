import { Injectable, Signal, computed, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioRecorderService {
    private mediaRecorder?: MediaRecorder;
    private stream?: MediaStream;
    private audioChunks: Blob[] = [];

    // Internal signals
    private command = signal<'start' | 'stop' | null>(null);
    private recording = signal(false);
    private audioUrl = signal<string | null>(null);
    private audioBlob = signal<Blob | null>(null);

    // Public signals
    readonly isRecording: Signal<boolean> = this.recording.asReadonly();
    readonly audio: Signal<string | null> = this.audioUrl.asReadonly();
    readonly audioFile: Signal<Blob | null> = this.audioBlob.asReadonly();

    constructor() {
        effect(() => {
            const cmd = this.command();
            if (cmd === 'start') this.initAndStart();
            if (cmd === 'stop') this.stop();
        });
    }

    toggle(): void {
        this.command.set(this.recording() ? 'stop' : 'start');
    }

    reset(): void {
        this.audioUrl.set(null);
        this.audioBlob.set(null);
    }

    // === Internals ===

    private async initAndStart(): Promise<void> {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('Stream:', this.stream);
            console.log('Tracks:', this.stream.getTracks());
            this.audioChunks = [];
            this.mediaRecorder = new MediaRecorder(this.stream);

            this.mediaRecorder.ondataavailable = (e) => {
                console.log(e);
                if (e.data.size > 0) {
                    console.log(e.data);
                    this.audioChunks.push(e.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
                this.audioBlob.set(blob);
                this.audioUrl.set(URL.createObjectURL(blob));
                this.cleanup();
            };

            this.mediaRecorder.start(); // Can also pass interval: .start(1000)
            this.recording.set(true);
        } catch (err) {
            console.error('Could not start audio recording:', err);
        }
    }

    private stop(): void {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop(); // Triggers `ondataavailable` + `onstop`
            this.recording.set(false);
        }
    }

    private cleanup(): void {
        this.stream?.getTracks().forEach((track) => track.stop());
        this.mediaRecorder = undefined;
        this.stream = undefined;
    }
}