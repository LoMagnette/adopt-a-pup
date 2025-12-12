package be.lomagnette.ai.puppy;

import be.lomagnette.rest.PuppySearchForm;
import dev.langchain4j.agentic.scope.AgenticScopeAccess;
import dev.langchain4j.agentic.scope.ResultWithAgenticScope;
import dev.langchain4j.service.V;

public interface PuppyExpertAgent  extends AgenticScopeAccess {

    ResultWithAgenticScope<PuppySearchResult> ask(@V("request") String message, @V("form") PuppySearchForm form, @V("info") String extraInfo);
}
