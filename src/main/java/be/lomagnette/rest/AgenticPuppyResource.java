package be.lomagnette.rest;

import be.lomagnette.service.AgenticPuppyService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;

import java.io.File;
import java.io.IOException;

@Path("/agentic/puppies/")
public class AgenticPuppyResource {

    private final AgenticPuppyService service;

    public AgenticPuppyResource(AgenticPuppyService service) {
        this.service = service;
    }
    @Path("chat")
    @Consumes("multipart/form-data")
    @POST
    public Response chat(@RestForm @PartType(MediaType.APPLICATION_JSON) ChatMessage<PuppySearchForm> form,
                         @RestForm("file") File file,
                         @RestForm("audio") File audio) {
        try {
            return Response.ok(this.service.chat(form, file, audio)).build();
        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

}
