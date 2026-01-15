package be.lomagnette.ai.adoption;

import be.lomagnette.entities.Puppy;
import be.lomagnette.service.AdoptionForm;
import dev.langchain4j.agentic.Agent;
import dev.langchain4j.agentic.declarative.Output;
import dev.langchain4j.agentic.declarative.ParallelAgent;
import dev.langchain4j.agentic.declarative.SubAgent;
import dev.langchain4j.service.V;

import java.util.Map;

public interface AdoptionCompletedAgent {

    @Agent(description = "Congratulate the user for adopting a puppy and summarize the adoption process")
    @ParallelAgent(
            subAgents = {
                    @SubAgent(type=AdoptionSummarizer.class),
                    @SubAgent(type=AdoptionCongratulation.class)
            },
            outputName = "summary"
    )
    Map<String, String> congratulateUser(@V("updatedForm") AdoptionForm form, @V("puppy") Puppy puppy);

    @Output
    static Map<String, String> summary(@V("summary") String summary, @V("guidance") String guidance) {
        return Map.of("summary", summary, "guidance", guidance);
    }

}

