package be.lomagnette.rest;

import be.lomagnette.entities.AdoptionRequest;
import be.lomagnette.service.AgenticAdoptionService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;

import java.io.File;
import java.io.IOException;

@Path("/agentic/adoption/")
public class AgenticAdoptionResource {


    private final AgenticAdoptionService service;

    public AgenticAdoptionResource(AgenticAdoptionService service) {
        this.service = service;
    }

    @Path("chat")
    @Consumes("multipart/form-data")
    @POST
    public ChatMessage<AdoptionRequest> chat(@RestForm@PartType(MediaType.APPLICATION_JSON) ChatMessage<AdoptionRequest> form,
                                             @RestForm("file") File file ) throws IOException {
        return this.service.chat(form, file);
    }
}
