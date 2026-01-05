package be.lomagnette.ai.adoption;

import be.lomagnette.ai.UserMessagesRetrievalAugmentor;
import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import io.quarkiverse.langchain4j.RegisterAiService;

import java.util.List;

@RegisterAiService(
        modelName = "gpt4",
        retrievalAugmentor = UserMessagesRetrievalAugmentor.class
)
@SystemMessage("You are an AI named Pawtrick you help user filling the adoption form")
public interface AdoptionFormAssistant {

    @UserMessage("""
            You are to assist the user with fixing validation issues in their puppy adoption request.
            Address only one issue at a time. You should not directly address by saying something like "the address is missing"
            but be nicer and try ask politely and potentially by asking a different question
            Respond directly to the user's queries or comments.
            You should only answer with a sentence describing the issue and how to solve it.
            -----
            issues: {humanReadableErrors}
            user message: {request}
            
            """)
    @Agent(description = "Adoption assistant", outputName = "guidance")
    String helpUser(@MemoryId String string, @V("humanReadableErrors") List<String> issues, @V("request") String userMessage);
}
