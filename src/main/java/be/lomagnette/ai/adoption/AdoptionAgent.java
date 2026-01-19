package be.lomagnette.ai.adoption;

import be.lomagnette.entities.Puppy;
import be.lomagnette.service.AdoptionForm;
import dev.langchain4j.agentic.scope.AgenticScopeAccess;
import dev.langchain4j.service.V;

public interface AdoptionAgent extends AgenticScopeAccess {

    AdoptionProcessResult helpAdoption(@V("id") String id, @V("request") String message, @V("form") AdoptionForm form, @V("puppy") Puppy puppy, @V("info") String extraInfo);
}
