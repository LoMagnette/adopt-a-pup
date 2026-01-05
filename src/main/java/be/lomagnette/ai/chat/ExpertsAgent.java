package be.lomagnette.ai.chat;

import be.lomagnette.ai.CategorizationResponse;
import be.lomagnette.ai.RequestCategory;
import be.lomagnette.ai.adoption.AdoptionAiService;
import be.lomagnette.ai.puppy.PuppyExpertAiService;
import be.lomagnette.ai.puppy.PuppyParadiseAgent;
import dev.langchain4j.agentic.declarative.ActivationCondition;
import dev.langchain4j.agentic.declarative.ConditionalAgent;
import dev.langchain4j.agentic.declarative.Output;
import dev.langchain4j.agentic.declarative.SubAgent;
import dev.langchain4j.agentic.scope.AgenticScopeAccess;
import dev.langchain4j.agentic.scope.ResultWithAgenticScope;
import dev.langchain4j.service.V;

public interface ExpertsAgent extends AgenticScopeAccess {

    @ConditionalAgent(outputName = "categoryAndResponse",
            subAgents = {
                @SubAgent(type=PuppyExpertAiService.class),
                @SubAgent(type=PuppyParadiseAgent.class),
                @SubAgent(type=AdoptionAiService.class)
    })
    ResultWithAgenticScope<CategorizationResponse> askExpert(@V("request") String request);

    @ActivationCondition(PuppyExpertAiService.class)
    static boolean activateMedical(@V("category") RequestCategory category) {
        return category == RequestCategory.PUPPY;
    }

    @ActivationCondition(PuppyParadiseAgent.class)
    static boolean activateTechnical(@V("category") RequestCategory category) {
        return category == RequestCategory.COMPANY;
    }

    @ActivationCondition(AdoptionAiService.class)
    static boolean activateLegal(@V("category") RequestCategory category) {
        return category == RequestCategory.ADOPTION;
    }

    @Output
    static CategorizationResponse createResponseAndCategory(@V("category") RequestCategory category, @V("response") String response) {
        return new CategorizationResponse(category,response);
    }
}
