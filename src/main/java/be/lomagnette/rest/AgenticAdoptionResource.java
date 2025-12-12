package be.lomagnette.rest;

import be.lomagnette.entities.AdoptionRequest;
import be.lomagnette.service.AgenticAdoptionService;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

@Path("/agentic/adoption/")
public class AgenticAdoptionResource {


    private final AgenticAdoptionService service;

    public AgenticAdoptionResource(AgenticAdoptionService service) {
        this.service = service;
    }

    @Path("chat")
    @POST
    public ChatMessage<AdoptionRequest> chat(ChatMessage<AdoptionRequest> form) {
        return this.service.chat(form);
    }
}
