package be.lomagnette.rest;

import be.lomagnette.ai.*;
import be.lomagnette.entities.PuppyRepository;
import dev.langchain4j.agentic.AgenticServices;
import dev.langchain4j.agentic.UntypedAgent;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

import java.util.Map;

@Path("agent")
public class AgenticResource {


    private final PuppyRepository repo;


    public AgenticResource(
                           PuppyRepository repo) {
        this.repo = repo;
    }

    @POST
    public CategorizationResponse chat(String question){
        CategoryRouter router = AgenticServices.agentBuilder(CategoryRouter.class).build();

        PuppyExpertAiService puppyExpert  = AgenticServices.agentBuilder(PuppyExpertAiService.class).build();
        PuppyParadiseAgent companyExpert  = AgenticServices.agentBuilder(PuppyParadiseAgent.class).build();
        AdoptionAgent adoptionExpert  = AgenticServices.agentBuilder(AdoptionAgent.class).build();

        UntypedAgent expertsAgent = AgenticServices.conditionalBuilder()
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

        var answer = expertRouterAgent.ask(question);
        return answer.result();
    }


    @POST
    @Path("/puppy")
    public String findPuppy(String question){
        PuppyFormFiller fillerExpert  = AgenticServices.agentBuilder(PuppyFormFiller.class).build();
        var guidanceExpert  = AgenticServices.agentBuilder(PuppyGuidanceExpert.class).build();

        UntypedAgent puppyGuider = AgenticServices
                .sequenceBuilder()
                .subAgents(fillerExpert, new PuppyFinder(repo), guidanceExpert)
                .outputName("guidance")
                .build();

        Map<String, Object> input = Map.of(
                "info", "",
                "request", question,
                "form", new PuppySearchForm(null, null, null, null, null, null, null, true, null)
        );

        return (String) puppyGuider.invoke(input);
    }

}

