package be.lomagnette.rest;

import be.lomagnette.entities.Puppy;
import be.lomagnette.entities.PuppyRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;

import java.util.List;

@Path("/puppies")
public class PuppyResource {

    private final PuppyRepository repository;

    @Inject
    public PuppyResource(PuppyRepository repository) {
        this.repository = repository;
    }

    @GET
    public List<Puppy> list() {
        return Puppy.listAll();
    }

    @Path("/{id}")
    @GET
    public Puppy get(Long id) {
        return Puppy.findById(id);
    }

    @Path("/search")
    @POST
    public List<Puppy> search(PuppySearchForm form) {
        return Puppy.search(form);
    }

    @Path("breeds")
    @GET
    public List<String> listBreeds() {
        return repository.listAvailableBreeds();
    }

    @Path("qualities")
    @GET
    public List<String> listQualities() {
        return repository.listAllGoodWithValues();
    }

    @Path("featured")
    @GET
    public List<Puppy> listFeatured(@QueryParam("limit") Integer limit) {
        if (limit == null || limit < 1) {
            limit = 10; // default value
        }
        return Puppy.find("available = true")
                .range(0, limit - 1)
                .list();
    }
}
