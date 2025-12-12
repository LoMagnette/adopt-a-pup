package be.lomagnette.service;

import be.lomagnette.ai.*;
import be.lomagnette.ai.adoption.*;
import be.lomagnette.entities.AdoptionRequest;
import be.lomagnette.rest.ChatMessage;
import dev.langchain4j.agentic.AgenticServices;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

import java.util.Set;

@ApplicationScoped
public class AgenticAdoptionService {
    private final UserService userService;
    private final Validator validator;
    private final ChatService chatService;


    private final AdoptionFormFiller formFiller = AgenticServices.agentBuilder(AdoptionFormFiller.class).build();
    private final AdoptionSummzarizer summzarizer = AgenticServices.agentBuilder(AdoptionSummzarizer.class).build();
    private final HumanReadableAgent humanReadableAgent = AgenticServices.agentBuilder(HumanReadableAgent.class).build();
    private final AdoptionFormAssistant assistant = AgenticServices.agentBuilder(AdoptionFormAssistant.class).build();
    private final AdoptionCongratulation congratulation = AgenticServices.agentBuilder(AdoptionCongratulation.class).build();

    public AgenticAdoptionService(UserService userService,
                                  Validator validator,
                                  ChatService chatService) {
        this.userService = userService;
        this.validator = validator;
        this.chatService = chatService;
    }


    public ChatMessage<AdoptionRequest> chat(ChatMessage<AdoptionRequest> form) {
        chatService.storeQuestions(form.text());
        var userHelper = AgenticServices.sequenceBuilder().subAgents(humanReadableAgent, assistant).build();
        var successParallelAgent =  AgenticServices.parallelBuilder().subAgents(congratulation, summzarizer).build();
        var validationConditionalAgent = AgenticServices
                .conditionalBuilder()
                .subAgents(scope -> ((Set<ConstraintViolation<AdoptionForm>>) scope.readState("errors")).isEmpty(), successParallelAgent)
                .subAgents(scope -> !((Set<ConstraintViolation<AdoptionForm>>) scope.readState("errors")).isEmpty(), userHelper)
                .build();
        var agent = AgenticServices
                .sequenceBuilder(AdoptionAgent.class)
                .subAgents(formFiller, new AdoptionFormValidator(validator), validationConditionalAgent)
                .output(scope -> {
                    var updatedForm = new AdoptionRequest(form.data().puppy, scope.readState("updatedForm", null));
                    var message = scope.readState("guidance", "");
                    var summary = scope.readState("summary", "");
                    return new AdoptionProcessResult(message, updatedForm, summary);
                })
                .build();

        var result = agent.helpAdoption(userService.getUser().id().toString(), form.text(), new AdoptionForm(form.data()), form.data().puppy);
        return new ChatMessage<>(result.message(), result.form(), RequestCategory.ADOPTION, result.summary());
    }

}
