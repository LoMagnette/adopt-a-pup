package be.lomagnette.rest;

import be.lomagnette.ai.AdoptionAgent;
import be.lomagnette.entities.AdoptionRequest;
import be.lomagnette.service.AdoptionService;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

import java.util.List;

@Path("adoption")
public class AdoptionResource {

    private final AdoptionService service;
    private final AdoptionAgent expert;

    public AdoptionResource(AdoptionService service, AdoptionAgent expert) {
        this.service = service;
        this.expert = expert;
    }

    @POST
    @Transactional
    public boolean process(AdoptionRequest request) {
        AdoptionRequest.persist(request);
        return true;
    }

    @GET
    public List<AdoptionRequest> list() {
        return AdoptionRequest.listAll();
    }

    @Path("chat")
    @POST
    public ChatMessage<AdoptionRequest> chat(ChatMessage<AdoptionRequest> form) {
        return this.service.chat(form);
    }

    @Path("summary")
    @Produces("text/plain")
    @POST
    public String help(AdoptionRequest request) {
        return this.expert.generateSummary(request);
    }
}
