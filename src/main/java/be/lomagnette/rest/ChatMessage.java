package be.lomagnette.rest;

import be.lomagnette.ai.RequestCategory;

public record ChatMessage<T>(
        String text,
        T data,
        RequestCategory category
) {
}