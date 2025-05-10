package be.lomagnette.rest;

import be.lomagnette.entities.AdoptionRequest;
import be.lomagnette.service.AdoptionService;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

import java.util.List;

@Path("adoption")
public class AdoptionResource {

    private final AdoptionService service;

    public AdoptionResource(AdoptionService service) {
        this.service = service;
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
}
