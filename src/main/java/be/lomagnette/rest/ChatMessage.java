package be.lomagnette.rest;

import be.lomagnette.ai.RequestCategory;

public record ChatMessage<T>(
        String text,
        T data,
        RequestCategory category,
        String htmlContent
) {

    public ChatMessage(String text, T data, RequestCategory category, String htmlContent) {
        this.text = text;
        this.data = data;
        this.category = category;
        this.htmlContent = htmlContent;
    }

    public ChatMessage( String text, T data, RequestCategory category) {
        this(text, data, category, "");
    }
}