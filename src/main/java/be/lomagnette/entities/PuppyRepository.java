package be.lomagnette.entities;

import dev.langchain4j.agent.tool.Tool;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class PuppyRepository implements PanacheRepository<Puppy> {

    @Tool("List all the good with values of the available puppies")
    public List<String> listAllGoodWithValues() {
        return getEntityManager()
                .createNativeQuery("SELECT DISTINCT \"dog-quality\" FROM \"dog-quality\" ORDER BY \"dog-quality\"")
                .getResultList();
    }


    @Tool("List all the available breeds")
    public List<String> listAvailableBreeds() {
        return Puppy.find("SELECT DISTINCT breed FROM Puppy ORDER BY breed").project(String.class).list();
    }
}
