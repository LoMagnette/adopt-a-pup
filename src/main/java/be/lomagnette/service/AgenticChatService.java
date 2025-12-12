package be.lomagnette.service;

import be.lomagnette.ai.*;
import be.lomagnette.ai.adoption.AdoptionAiService;
import be.lomagnette.ai.puppy.PuppyExpertAiService;
import be.lomagnette.ai.puppy.PuppyParadiseAgent;
import be.lomagnette.rest.ChatMessage;
import dev.langchain4j.agentic.AgenticServices;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AgenticChatService {

    CategoryRouter router = AgenticServices.agentBuilder(CategoryRouter.class).build();
    PuppyExpertAiService puppyExpert  = AgenticServices.agentBuilder(PuppyExpertAiService.class).build();
    PuppyParadiseAgent companyExpert  = AgenticServices.agentBuilder(PuppyParadiseAgent.class).build();
    AdoptionAiService adoptionExpert  = AgenticServices.agentBuilder(AdoptionAiService.class).build();


    public ChatMessage<Void> chat(ChatMessage<Void> question) {
         var expertsAgent = AgenticServices.conditionalBuilder()
                .subAgents( agenticScope -> agenticScope.readState("category", RequestCategory.UNKNOWN) == RequestCategory.PUPPY, puppyExpert)
                .subAgents( agenticScope -> agenticScope.readState("category", RequestCategory.UNKNOWN) == RequestCategory.ADOPTION, adoptionExpert)
                .subAgents( agenticScope -> agenticScope.readState("category", RequestCategory.UNKNOWN) == RequestCategory.COMPANY, companyExpert)
                .build();

        ExpertRouterAgent expertRouterAgent = AgenticServices
                .sequenceBuilder(ExpertRouterAgent.class)
                .subAgents(router, expertsAgent)
                .outputName("categoryAndResponse")
                .output(scope -> {
                    var category = scope.readState("category", RequestCategory.UNKNOWN);
                    var response = scope.readState("response","");
                    return new CategorizationResponse(category,response);
                })
                .build();

        var answer = expertRouterAgent.ask(question.text());
        return new ChatMessage<>(answer.result().response(), null, answer.result().category());
    }
}
