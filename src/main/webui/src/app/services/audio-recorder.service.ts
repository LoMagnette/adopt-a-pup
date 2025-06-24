// audio-recorder.service.ts
import { Injectable, Signal, computed, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioRecorderService {
    private mediaRecorder?: MediaRecorder;
    private stream?: MediaStream;
    private audioChunks: Blob[] = [];

    // Signals to expose and mutate state
    private command = signal<'start' | 'stop' | null>(null);
    private recording = signal(false);
    private audioUrl = signal<string | null>(null);
    private audioBlob = signal<Blob | null>(null);

    // Publicly exposed signals
    isRecording = this.recording.asReadonly()
    audio = this.audioUrl.asReadonly()
    audioFile=  this.audioBlob.asReadonly();



    constructor() {
        // Reactively respond to changes in `command`
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
    }

    // Internals

    private async initAndStart(): Promise<void> {
        try {
            console.log("Starting recording");
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) this.audioChunks.push(e.data);
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
                this.audioUrl.set(URL.createObjectURL(blob));
                this.cleanup();
            };

            this.mediaRecorder.start();
            this.recording.set(true);
            console.log("Starting recording", this.recording());
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    private stop(): void {
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
            this.recording.set(false);
            const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
            this.audioBlob.set(blob);
            this.audioUrl.set(URL.createObjectURL(blob));
        }
    }

    private cleanup(): void {
        this.stream?.getTracks().forEach((track) => track.stop());
        this.mediaRecorder = undefined;
        this.stream = undefined;
    }
}