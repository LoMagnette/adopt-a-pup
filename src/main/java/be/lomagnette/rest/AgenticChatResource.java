package be.lomagnette.rest;

import be.lomagnette.service.AgenticChatService;
import jakarta.inject.Inject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

@Path("agentic")
public class AgenticChatResource {

    private final AgenticChatService chatService;

    @Inject
    public AgenticChatResource(AgenticChatService chatService) {
        this.chatService = chatService;
    }

    @POST
    public ChatMessage<Void> chat(ChatMessage<Void> question) {
        return chatService.chat(question);
    }
}
