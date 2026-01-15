package be.lomagnette.service;

import be.lomagnette.ai.RequestCategory;
import be.lomagnette.ai.puppy.*;
import be.lomagnette.entities.PuppyRepository;
import be.lomagnette.rest.ChatMessage;
import be.lomagnette.rest.PuppySearchForm;
import dev.langchain4j.agentic.AgenticServices;
import dev.langchain4j.agentic.scope.AgenticScope;
import jakarta.enterprise.context.ApplicationScoped;
import org.jspecify.annotations.NonNull;

import java.io.File;
import java.io.IOException;

@ApplicationScoped
public class AgenticPuppyService {

    private final PuppyRepository repo;
    private final ChatService chatService;
    private final Utils utils;

    private final PuppyFormFiller fillerExpert  = AgenticServices.agentBuilder(PuppyFormFiller.class).build();
    private final PuppyGuidanceExpert guidanceExpert  = AgenticServices.agentBuilder(PuppyGuidanceExpert.class).build();

    public AgenticPuppyService(PuppyRepository repo, ChatService chatService, Utils utils) {
        this.chatService = chatService;
        this.repo = repo;
        this.utils = utils;
    }

    public ChatMessage<PuppySearchForm> chat(ChatMessage<PuppySearchForm> form, File file, File audio) throws IOException {
        chatService.storeQuestions(form.text());
        var extraInfo = utils.extractExtraInfo(file);
        var audioInf = utils.extractExtraInfo(audio);

        PuppyExpertAgent puppyGuider = AgenticServices
                .sequenceBuilder(PuppyExpertAgent.class)
                .subAgents(fillerExpert, new PuppyFinder(repo), guidanceExpert)
                .output(scope -> getPuppySearchResult(form, scope))
                .build();

        var output = puppyGuider.ask(form.text(),form.data(),extraInfo);

        return new ChatMessage<>(output.result().answer(), output.result().form(), RequestCategory.PUPPY);
    }

    private static @NonNull PuppySearchResult getPuppySearchResult(ChatMessage<PuppySearchForm> form, AgenticScope scope) {
        var formUpdated = scope.readState("form", form.data());
        var guidance = scope.readState("guidance","");
        return new PuppySearchResult(formUpdated, guidance);
    }

}
