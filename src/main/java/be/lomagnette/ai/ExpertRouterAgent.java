package be.lomagnette.ai;

import dev.langchain4j.agentic.Agent;
import dev.langchain4j.agentic.declarative.ConditionalAgent;
import dev.langchain4j.agentic.scope.AgenticScopeAccess;
import dev.langchain4j.agentic.scope.ResultWithAgenticScope;
import dev.langchain4j.service.V;

public interface ExpertRouterAgent extends AgenticScopeAccess {

    ResultWithAgenticScope<CategorizationResponse> ask(@V("request") String request);
}
