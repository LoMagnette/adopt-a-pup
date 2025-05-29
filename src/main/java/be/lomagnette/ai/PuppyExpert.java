package be.lomagnette.ai;

import be.lomagnette.entities.Puppy;
import be.lomagnette.entities.PuppyRepository;
import be.lomagnette.rest.PuppySearchForm;
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;
import io.quarkiverse.langchain4j.ToolBox;

import java.util.List;

@RegisterAiService(
        modelName = "gpt4",
        retrievalAugmentor = UserMessagesRetrievalAugmentor.class,
        tools = {PuppyRepository.class}
)
@SystemMessage("You are an AI named Pawtrick you help user finding the best puppy based on the information they provide")
public interface PuppyExpert {

    @UserMessage("""
            Fill the the provided object based on the information given by the user.
            You should only update the field for which you have information.
            A field that is null must be filled by the user.
            You should always answer in a JSON format.
            Please provide a concise response in a single line without using newline or backslash characters.
            ------
            user message: {message}
            current form: {form}
            extra info: {extraInfo}
            """)
    @ToolBox(PuppyRepository.class)
    PuppySearchForm fillForm(@MemoryId String id, String message, PuppySearchForm form, String extraInfo);

    @UserMessage("""
            - Get all the good with qualities availabe.
            - Filter all those qualities based on the user message
            - return the filtered list as a comma separated list
            
            -----
            user message: {message}
            """)
    @ToolBox(PuppyRepository.class)
    String collectQualities(String message);


    @UserMessage("""
            You should try to answer the user questions about puppies and dog breeds. You can should welcome any other precision
            about the ideal puppy for the user.
            {message}
            """)
    String chat(String message);

    @UserMessage("""
            You should try to guide the user into finding the right puppy.
            To do so you can ask question or provide description based on it's message and on the found puppies.
            ----
            user message: {message}
            found puppies: {puppies}
            """)
    String guidePuppySelection(String message, List<Puppy> puppies);

    @UserMessage("""
            You should return the list of the qualities that correspond to the user message
            Todo so follow these steps:
                       - retrieve all the good with qualities using a tool
                       - among the retrieved qualities keep only the one matching the user message
                       - return the resulting list
            You should only return the list nothing more.
            -----
            user message: {message}
            """)
    @ToolBox(PuppyRepository.class)
    List<String> matchingQualities(String message);
}
