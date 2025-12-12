package be.lomagnette.ai.adoption;

import be.lomagnette.ai.UserMessagesRetrievalAugmentor;
import be.lomagnette.service.AdoptionForm;
import be.lomagnette.service.UserService;
import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import io.quarkiverse.langchain4j.RegisterAiService;
import io.quarkiverse.langchain4j.ToolBox;


@RegisterAiService(
        modelName = "gpt4",
        retrievalAugmentor = UserMessagesRetrievalAugmentor.class
)
@SystemMessage("You are an AI named Pawtrick you help user filling the adoption form")
public interface AdoptionFormFiller {

    @UserMessage("""
            Fill the the provided object based on the information given by the user.
            You should only update the field for which you have information.
            A field that is null must be filled by the user.
            You should always answer in a JSON format.
            Please provide a concise response in a single line without using newline or backslash characters.
            ------
            user message: {request}
            current form: {form}
            """)
    @ToolBox(UserService.class)
    @Agent(description = "Expert at filling form for puppy adoption", outputKey = "updatedForm")
    AdoptionForm fillForm(@MemoryId String id, @V("request") String message, @V("form") AdoptionForm form);
}
