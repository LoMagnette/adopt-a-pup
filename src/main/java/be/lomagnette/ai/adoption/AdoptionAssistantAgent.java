package be.lomagnette.ai.adoption;


import be.lomagnette.service.AdoptionForm;
import dev.langchain4j.agentic.Agent;
import dev.langchain4j.agentic.declarative.Output;
import dev.langchain4j.agentic.declarative.SequenceAgent;
import dev.langchain4j.agentic.declarative.SubAgent;
import dev.langchain4j.service.V;
import jakarta.validation.ConstraintViolation;

import java.util.Set;

public interface AdoptionAssistantAgent {


    @Agent(description = "Help the user fix the issues from the form")
    @SequenceAgent(
            subAgents = {
                    @SubAgent(type = HumanReadableAgent.class),
                    @SubAgent(type = AdoptionFormAssistant.class)
            },
            outputName = "guidance"
    )
    String helpUser(@V("errors") Set<ConstraintViolation<AdoptionForm>> validations);


    @Output
    static String createGuidance(@V("guidance") String guidance) {
        return guidance;
    }
}
