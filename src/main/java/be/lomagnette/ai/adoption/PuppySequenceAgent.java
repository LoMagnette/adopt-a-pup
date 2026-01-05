package be.lomagnette.ai.adoption;

import be.lomagnette.ai.puppy.PuppyFinder;
import be.lomagnette.ai.puppy.PuppyFormFiller;
import be.lomagnette.ai.puppy.PuppyGuidanceExpert;
import be.lomagnette.ai.puppy.PuppySearchResult;
import be.lomagnette.rest.PuppySearchForm;
import dev.langchain4j.agentic.declarative.Output;
import dev.langchain4j.agentic.declarative.SequenceAgent;
import dev.langchain4j.agentic.declarative.SubAgent;
import dev.langchain4j.agentic.scope.ResultWithAgenticScope;
import dev.langchain4j.service.V;

public interface PuppySequenceAgent {

    @SequenceAgent(
            outputName = "result",
            subAgents = {
                    @SubAgent(type=PuppyFormFiller.class),
                    @SubAgent(type=PuppyFinder.class),
                    @SubAgent(type=PuppyGuidanceExpert.class)
            })
    ResultWithAgenticScope<PuppySearchResult> ask(@V("request") String message, @V("form") PuppySearchForm form, @V("info") String extraInfo);

    @Output
    static PuppySearchResult result(@V("form") PuppySearchForm form, @V("guidance")String guidance) {
        return new PuppySearchResult(form, guidance);
    }

}
