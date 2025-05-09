package be.lomagnette.ai;

import be.lomagnette.entities.PuppyRepository;
import be.lomagnette.rest.PuppySearchForm;
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;
import io.quarkiverse.langchain4j.ToolBox;

@RegisterAiService(
        retrievalAugmentor = UserMessagesRetrievalAugmentor.class
)
@SystemMessage("You are an AI named Pawtrick you help user finding the best puppy based on the information they provide")
public interface PuppyExpert {

    @UserMessage("""
            Fill the the provided object based on the information given by the user.
            You should only update the field for which you have information.
            A field that is null must be filled by the user.
            You should always answer in a JSON format.
            Please provide a concise response in a single line without using newline or backslash characters.
            {message}
            {form}
            """)
    @ToolBox(PuppyRepository.class)
    public PuppySearchForm search(@MemoryId String id, String message, PuppySearchForm form);


    @UserMessage("""
            You should try to answer the user questions about puppies and dog breeds. You can should welcome any other precision
            about the ideal puppy for the user.
            {message}
            """)
    public String chat(String message);
}
