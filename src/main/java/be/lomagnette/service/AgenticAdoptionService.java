package be.lomagnette.service;

import be.lomagnette.ai.*;
import be.lomagnette.ai.adoption.*;
import be.lomagnette.entities.AdoptionRequest;
import be.lomagnette.rest.ChatMessage;
import dev.langchain4j.agentic.AgenticServices;
import dev.langchain4j.agentic.scope.AgenticScope;
import dev.langchain4j.model.chat.ChatModel;
import io.quarkiverse.langchain4j.ModelName;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.jspecify.annotations.NonNull;

import java.io.File;
import java.util.Set;

@ApplicationScoped
public class AgenticAdoptionService {
    private final UserService userService;
    private final Validator validator;
    private final ChatService chatService;

    @Inject()
    @ModelName("gpt4")
    ChatModel gpt4;


    //private final AdoptionFormFiller formFiller = AgenticServices.createAgenticSystem(AdoptionFormFiller.class,gpt4);
    //private final AdoptionAssistantAgent userHelper = AgenticServices.createAgenticSystem(AdoptionAssistantAgent.class,gpt4);
    private final AdoptionFormFiller formFiller = AgenticServices.agentBuilder(AdoptionFormFiller.class).build();
    private final AdoptionSummarizer summzarizer = AgenticServices.agentBuilder(AdoptionSummarizer.class).build();
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


    public ChatMessage<AdoptionRequest> chat(ChatMessage<AdoptionRequest> form, File file) {
        chatService.storeQuestions(form.text());

        var userHelper = AgenticServices.sequenceBuilder().subAgents(humanReadableAgent, assistant).build();
        var successParallelAgent =  AgenticServices.parallelBuilder().subAgents(congratulation, summzarizer).build();

        var validationConditionalAgent = AgenticServices
                .conditionalBuilder()
                .subAgents(scope -> (!hasErrors(scope)), successParallelAgent)
                .subAgents(AgenticAdoptionService::hasErrors, userHelper)
                .build();

        var agent = AgenticServices
                .sequenceBuilder(AdoptionAgent.class)
                .subAgents(formFiller, new AdoptionFormValidator(validator), validationConditionalAgent)
                .output(scope -> getAdoptionProcessResult(form, scope))
                .build();

        var result = agent.helpAdoption(userService.getUser().id().toString(), form.text(), new AdoptionForm(form.data()), form.data().puppy);
        return new ChatMessage<>(result.message(), result.form(), RequestCategory.ADOPTION, result.summary());
    }

    private static @NonNull AdoptionProcessResult getAdoptionProcessResult(ChatMessage<AdoptionRequest> form, AgenticScope scope) {
        var updatedForm = new AdoptionRequest(form.data().puppy, scope.readState("updatedForm", null));
        var message = scope.readState("guidance", "");
        var summary = scope.readState("summary", "");
        return new AdoptionProcessResult(message, updatedForm, summary);
    }

    private static boolean hasErrors(AgenticScope scope) {
        return !((Set<ConstraintViolation<AdoptionForm>>) scope.readState("errors")).isEmpty();
    }

}
