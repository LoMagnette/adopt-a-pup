package be.lomagnette.rest;

import be.lomagnette.ai.*;
import be.lomagnette.entities.PuppyRepository;
import dev.langchain4j.agentic.AgenticServices;
import dev.langchain4j.agentic.UntypedAgent;
import dev.langchain4j.model.chat.ChatModel;
import io.quarkiverse.langchain4j.ModelName;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

import java.util.Map;

@Path("agent")
public class AgenticResource {


    private final ChatModel localModel;
    private final ChatModel gptModel;
    private final PuppyRepository repo;

    public AgenticResource(@ModelName("local") ChatModel localModel,
                           @ModelName("gpt4") ChatModel gptModel,
                           PuppyRepository repo) {
        this.localModel = localModel;
        this.gptModel = gptModel;
        this.repo = repo;
    }

    @POST
    public String chat(String question){
        CategoryRouter router = AgenticServices.agentBuilder(CategoryRouter.class)
                .chatModel(localModel)
                .outputName("category")
                .build();

        PuppyExpertAgent puppyExpert  = AgenticServices.agentBuilder(PuppyExpertAgent.class)
                .chatModel(localModel)
                .outputName("response")
                .build();

        PuppyParadiseAgent companyExpert  = AgenticServices.agentBuilder(PuppyParadiseAgent.class)
                .chatModel(localModel)
                .outputName("response")
                .build();

        AdoptionAgent adoptionExpert  = AgenticServices.agentBuilder(AdoptionAgent.class)
                .chatModel(localModel)
                .outputName("response")
                .build();

        UntypedAgent expertsAgent = AgenticServices.conditionalBuilder()
                .subAgents( agenticScope -> agenticScope.readState("category", RequestCategory.UNKNOWN) == RequestCategory.PUPPY, puppyExpert)
                .subAgents( agenticScope -> agenticScope.readState("category", RequestCategory.UNKNOWN) == RequestCategory.ADOPTION, adoptionExpert)
                .subAgents( agenticScope -> agenticScope.readState("category", RequestCategory.UNKNOWN) == RequestCategory.COMPANY, companyExpert)
                .build();

        ExpertRouterAgent expertRouterAgent = AgenticServices
                .sequenceBuilder(ExpertRouterAgent.class)
                .subAgents(router, expertsAgent)
                .outputName("response")
                .build();

        return expertRouterAgent.ask(question);
    }


    @POST
    @Path("/puppy")
    public String findPuppy(String question){
        PuppyFormFiller fillerExpert  = AgenticServices.agentBuilder(PuppyFormFiller.class)
                .chatModel(gptModel)
                .outputName("form")
                .build();

        PuppyGuidanceExpert guidanceExpert  = AgenticServices.agentBuilder(PuppyGuidanceExpert.class)
                .chatModel(gptModel)
                .outputName("guidance")
                .build();

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



      var result = (String) puppyGuider.invoke(input);
      return result;
    }

}

