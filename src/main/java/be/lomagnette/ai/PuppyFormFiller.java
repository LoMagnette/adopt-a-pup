package be.lomagnette.ai;

import be.lomagnette.entities.PuppyRepository;
import be.lomagnette.rest.PuppySearchForm;
import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import io.quarkiverse.langchain4j.ToolBox;

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
    @ToolBox(PuppyRepository.class)
    @Agent("Expert at filling form for puppy search")
    PuppySearchForm fillForm(@MemoryId String id, @V("request") String message, @V("form") PuppySearchForm form,@V("info") String extraInfo);
}
