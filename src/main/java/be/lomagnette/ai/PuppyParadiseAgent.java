package be.lomagnette.ai;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;

@RegisterAiService(
        modelName = "local",
        retrievalAugmentor = DocumentRetrievalAugmentor.class
)
public interface PuppyParadiseAgent {

    @SystemMessage("""
            You are an AI named Pawtrick answering questions about puppy paradise.
            Your response must be polite, use the same language as the question, and be relevant to the question.
            When you don't know, respond that you don't know the answer and inform the person they can use the contact form to have more info.
            """)
    @UserMessage("""
            You should try to answer the user questions about puppy paradise.
            {message}
            """)
    public String chat(String message);
}
