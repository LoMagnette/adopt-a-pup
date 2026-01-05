package be.lomagnette.ai.puppy;

import be.lomagnette.entities.Puppy;
import be.lomagnette.entities.PuppyRepository;
import be.lomagnette.rest.PuppySearchForm;
import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.V;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Arrays;
import java.util.List;

@ApplicationScoped
public class PuppyFinder {

    private final PuppyRepository puppyRepository;

    public PuppyFinder(PuppyRepository puppyRepository) {
        this.puppyRepository = puppyRepository;
    }

    @Agent(value = "Agent able to find the puppies", outputName = "puppies")
    public List<Puppy> findPuppies(@V("form") PuppySearchForm criteria){
        var goodWithValues = puppyRepository.listAllGoodWithValues().stream().map(String::toLowerCase).toList();
        var goodWithFound = criteria.goodWith() == null ? new String[0] : criteria.goodWith();
        var filteredGoodWith = Arrays.stream(goodWithFound).filter(goodWithValues::contains).toArray(String[]::new);
        criteria = PuppySearchForm.setGoodWith(criteria, filteredGoodWith);
        return Puppy.search(criteria);
    }
}
