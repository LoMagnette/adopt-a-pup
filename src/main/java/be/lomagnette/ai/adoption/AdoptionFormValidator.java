package be.lomagnette.ai.adoption;

import be.lomagnette.service.AdoptionForm;
import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.V;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

import java.util.Set;

public class AdoptionFormValidator {

    private final Validator validator;

    public AdoptionFormValidator(Validator validator) {
        this.validator = validator;
    }

    @Agent(description = "Validate the form", outputName = "errors")
    public Set<ConstraintViolation<AdoptionForm>> isValid(@V("updatedForm") AdoptionForm form) {
        return validator.validate(form);
    }
}
