package be.lomagnette.ai.puppy;

import be.lomagnette.entities.PuppyRepository;
import be.lomagnette.rest.PuppySearchForm;
import dev.langchain4j.agentic.Agent;
import dev.langchain4j.agentic.declarative.ChatMemorySupplier;
import dev.langchain4j.agentic.declarative.ChatModelSupplier;
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import io.quarkiverse.langchain4j.RegisterAiService;
import io.quarkiverse.langchain4j.ToolBox;

@RegisterAiService(
        modelName = "gpt4"
)
public interface PuppyFormFiller {

    @UserMessage("""
            Fill the the provided object based on the information given by the user.
            You should only update the field for which you have information.
            A field that is null must be filled by the user.
            You should always answer in a JSON format.
            Please provide a concise response in a single line without using newline or backslash characters.
            ------
            user message: {request}
            current form: {form}
            extra info: {info}
            """)
    @ChatModelSupplier()
    @ToolBox(PuppyRepository.class)
    @Agent(description = "Expert at filling form for puppy search", outputName = "form")
    PuppySearchForm fillForm(@V("request") String message, @V("form") PuppySearchForm form, @V("info") String extraInfo);
}
