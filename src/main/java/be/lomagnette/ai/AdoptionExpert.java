package be.lomagnette.ai;

import be.lomagnette.entities.AdoptionRequest;
import be.lomagnette.service.UserService;
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;
import io.quarkiverse.langchain4j.ToolBox;
import jakarta.validation.ConstraintViolation;

import java.util.List;
import java.util.Set;

@RegisterAiService(
        retrievalAugmentor = UserMessagesRetrievalAugmentor.class
)
@SystemMessage("You are an AI named Pawtrick you help user filling the adoption form")
public interface AdoptionExpert {

    @UserMessage("""
            Fill the the provided object based on the information given by the user and the one you can collect about him.
            Those information are about the person adopting the puppy.
            You should only update the field for which you have information.
            To fill the information you should follow these steps:
            - retrieve the information about the user using a tool
            - fill the the form with all the information available
            
            A field that is null must be filled by the user.
            You should always answer in a JSON format.
            You should NOT update the information about the puppy.
            Please provide a concise response in a single line without using newline or backslash characters.
            
            Field value should not have this as a value "null" only null.
            -----
            User message:{message}
            form: {form}
            """)
    @ToolBox(UserService.class)
    AdoptionRequest fillAdoptionForm(@MemoryId String id, String message, AdoptionRequest form);

    @UserMessage("""
            You should try to answer the user questions about puppies adoption.
            You can should welcome any about the person that want to adopt a pup.
            {message}
            """)
    String chat(String message);


    @UserMessage("""
            Convert the list of validation errors into a List of human readable list of validation error.
             - Correct answers:
                - ["The email cannot be empty", "The last name cannot be empty", "You need to specify if you own or rent your current place"]
             - Incorrect answers:
                - ["The field "lastName" must not be empty", "The field "birthPlace" must not be empty"]
            
            ---
            validation errors: {validations}
            """
    )
    List<String> getHumanReadableErrors(Set<ConstraintViolation<AdoptionRequest>> validations);

    @UserMessage("""
            You are to assist the user with fixing validation issues in their puppy adoption request.
            Address only one issue at a time. You should not directly address by saying something like "the address is missing"
            but be nicer and try ask politely and potentially by asking a different question
            Respond directly to the user's queries or comments.
            You should only answer with a sentence describing the issue and how to solve it.
            -----
            issues: {issues}
            user message: {userMessage}
            
            """)
    String helpUser(@MemoryId String string, List<String> issues, String userMessage);


    @UserMessage("""
                The form to adopt the puppy has been properly filled.
                You should thanks the user for all the informations and invite him to review those before submiting their request
            """
    )
    String success();
}
