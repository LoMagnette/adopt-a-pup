export interface ChatMessage<T> {
    text:string,
    data?:T
    sender: 'user' | 'bot';
    timestamp: Date;
}
