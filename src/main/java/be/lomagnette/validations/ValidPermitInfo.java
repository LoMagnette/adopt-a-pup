package be.lomagnette.validations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PermitInfoValidator.class)
@Documented
public @interface ValidPermitInfo {
    String message() default "Permit number and expiry date must be provided when hasPetPermit is true";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
