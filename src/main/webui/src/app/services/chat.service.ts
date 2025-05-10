import {computed, inject, Injectable, signal} from '@angular/core';
import {ChatMessage} from "../models/chat-message";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {PuppyService} from "./puppy.service";
import {AdoptionService} from "./adoption.service";
import {PuppyFilters} from "../models/puppy-filters";


@Injectable({
    providedIn: 'root'
})
export class ChatService {
    // Messages storage using signal for reactivity
    private _messages = signal<ChatMessage<any>[]>([]);

    // Computed signal to get messages reactively
    public messages = this._messages.asReadonly();

    route = inject(ActivatedRoute);
    router = inject(Router);
    puppyService = inject(PuppyService);
    adoptionService = inject(AdoptionService);

    currentRoute = toSignal(this.route.url);
    routeString = computed(() => (this.currentRoute()|| []).map(value => value.path).join('/'));

    private http = inject(HttpClient);


    constructor() {
        // Initialize with a welcome message
        this.addBotMessage("Welcome! How can I assist you today?");
    }

    // Add a user message and trigger a bot response
    sendMessage(text: string, files: File[]) {
        this.addUserMessage(text);
        const url = this.getUrl();
        const message = this.getMessage(text, files);
        return this.http.post<ChatMessage<any>>(url, message).pipe(tap(response => {
                this.addBotMessage(response.text);
                if(response.data) {
                    if (response.category === 'PUPPY') {
                        const form:PuppyFilters = response.data;
                        const goodWith = this.puppyService.goodWith() || [];
                        form.goodWith.map( (value) => {
                            form.goodWith.push(value.toLowerCase());
                        })
                        form.goodWith = form.goodWith.filter( value => goodWith.includes(value))
                        this.puppyService.filter.set(response.data);
                    }else if (response.category === 'ADOPTION') {
                        this.adoptionService.setFormData(response.data);
                    }
                }
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

    private getUrl() {
        const currentRoute = this.router.url;
        if (!currentRoute) {
            return '/api/bot';
        } else if (currentRoute.includes('adopt')) {
            return '/api/adoption/chat';
        } else if (currentRoute.includes('puppies')) {
            return '/api/puppies/chat';
        } else {
            return '/api/bot';
        }

    }

    private getMessage(text: string, files: File[]) {
        const currentRoute = this.router.url;
        if (!currentRoute) {
            return {text}
        } else if (currentRoute.includes('adopt')) {
            const data = {
                ...this.adoptionService.getFormData()(),
                puppy: this.adoptionService.selectedPuppy()
            };
            console.log('data', data);
            return {text, data }
        } else if (currentRoute.includes('puppies')) {
            return {text, data:this.puppyService.filter()}
        } else {
            return {text}
        }
    }
}
