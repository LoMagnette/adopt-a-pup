export interface ChatMessage<T> {
    text:string,
    data?:T
    category?:'PUPPY'|'ADOPTION'|'COMPANY'
    sender: 'user' | 'bot';
    htmlContent?: string;
    timestamp: Date;
}
