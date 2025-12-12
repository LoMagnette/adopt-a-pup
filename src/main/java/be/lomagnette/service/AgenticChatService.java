package be.lomagnette.service;

import be.lomagnette.ai.*;
import be.lomagnette.ai.adoption.AdoptionAiService;
import be.lomagnette.ai.chat.ExpertsAgent;
import be.lomagnette.ai.puppy.PuppyExpertAiService;
import be.lomagnette.ai.puppy.PuppyParadiseAgent;
import be.lomagnette.rest.ChatMessage;
import dev.langchain4j.agentic.AgenticServices;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AgenticChatService {

    public ChatMessage<Void> chat(ChatMessage<Void> question) {
        var agenticSystem = AgenticServices.createAgenticSystem(ExpertsAgent.class);
        var answer = agenticSystem.askExpert(question.text());
        return new ChatMessage<>(answer.result().response(), null, answer.result().category());
    }
}
