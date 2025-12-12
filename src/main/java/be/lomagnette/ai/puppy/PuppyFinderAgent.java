package be.lomagnette.ai.puppy;


import be.lomagnette.entities.Puppy;
import be.lomagnette.rest.PuppySearchForm;
import dev.langchain4j.agentic.Agent;
import dev.langchain4j.agentic.declarative.SequenceAgent;
import dev.langchain4j.agentic.declarative.SubAgent;
import dev.langchain4j.service.V;

import java.util.List;

public interface PuppyFinderAgent {


    @Agent(description = "find the right puppy for the user")
    @SequenceAgent(
            subAgents = {
                    @SubAgent(type= PuppyFormFiller.class),
                    //@SubAgent(type = PuppyFinder.class),
                    @SubAgent(type= PuppyGuidanceExpert.class)
            },
            outputName = "guidance"
    )
    String findMeAPuppy(@V("info") String info, @V("request") String question, @V("form")PuppySearchForm form, @V("puppies")List<Puppy> puppies);
}
