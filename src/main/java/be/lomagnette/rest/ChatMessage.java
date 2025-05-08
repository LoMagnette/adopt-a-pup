package be.lomagnette.rest;

public record ChatMessage<T>(
        String text,
        T data
) {
}