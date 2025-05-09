package be.lomagnette.rest;

import be.lomagnette.service.ChatService;
import jakarta.inject.Inject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

@Path("bot")
public class ChatResource {

    private final ChatService chatService;

    @Inject
    public ChatResource(ChatService chatService) {
        this.chatService = chatService;
    }

    @POST
    public ChatMessage<Void> chat(ChatMessage<Void> question) {
        return chatService.chat(question);
    }
}
