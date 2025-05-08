package be.lomagnette.rest;

import be.lomagnette.entities.AdoptionRequest;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

import java.util.List;

@Path("adoption")
public class AdoptionResource {

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
}
