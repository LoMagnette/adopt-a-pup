package be.lomagnette.validations;

import be.lomagnette.entities.AdoptionRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PermitInfoValidator implements ConstraintValidator<ValidPermitInfo, AdoptionRequest> {

    @Override
    public boolean isValid(AdoptionRequest form, ConstraintValidatorContext context) {
        if (form == null) {
            return true; // leave null-checks to other validators
        }

        if (form.hasPetPermit) {
            boolean valid = form.permitNumber != null && !form.permitNumber.isBlank()
                    && form.permitExpiryDate != null;

            if (!valid) {
                context.disableDefaultConstraintViolation();

                if (form.permitNumber == null || form.permitNumber.isBlank()) {
                    context.buildConstraintViolationWithTemplate("Permit number is required")
                            .addPropertyNode("permitNumber").addConstraintViolation();
                }

                if (form.permitExpiryDate == null) {
                    context.buildConstraintViolationWithTemplate("Permit expiry date is required")
                            .addPropertyNode("permitExpiryDate").addConstraintViolation();
                }
            }

            return valid;
        }

        return true;
    }
}
