package be.lomagnette.ai;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;

import java.util.UUID;

@RegisterAiService
public interface Bot {

    @SystemMessage("""
            You are an AI named Pawtrick answering questions about puppy adoption.
            Your response must be polite, use the same language as the question, and be relevant to the question.
            When you don't know, respond that you don't know the answer and inform the person they can use the contact form to have more info.
            """)
    @UserMessage("""
            You should try to answer the user questions about puppy adoption.
            {question}
            """)
    String chat(@MemoryId UUID id, String question);
}
