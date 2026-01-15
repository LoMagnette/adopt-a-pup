package be.lomagnette.ai.adoption;

import be.lomagnette.service.AdoptionForm;
import dev.langchain4j.agentic.Agent;
import dev.langchain4j.agentic.declarative.Output;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import io.quarkiverse.langchain4j.RegisterAiService;
import jakarta.validation.ConstraintViolation;

import java.util.List;
import java.util.Set;

@RegisterAiService()
public interface HumanReadableAgent {

    @UserMessage("""
            Convert the list of validation errors into a List of human readable list of validation error.
             - Correct answers:
                - ["The email cannot be empty", "The last name cannot be empty", "You need to specify if you own or rent your current place"]
             - Incorrect answers:
                - ["The field "lastName" must not be empty", "The field "birthPlace" must not be empty"]
            
            ---
            validation errors: {errors}
            """
    )
    @Agent(description = "Convert the list of validation errors into a List of human readable list of validation error", outputName = "humanReadableErrors")
    List<String> getHumanReadableErrors(@V("errors") Set<ConstraintViolation<AdoptionForm>> validations);

    @Output
    static List<String> humanReadableErrors(@V("humanReadableErrors") List<String> humanReadableErrors) {
        return humanReadableErrors;
    }
}
