package be.lomagnette.service;

import be.lomagnette.entities.AdoptionRequest;
import dev.langchain4j.model.output.structured.Description;
import jakarta.persistence.Embedded;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;

public record AdoptionForm(
        // --- Personal Information ---
        @NotBlank
        @Description("First name of the applicant")
        String firstName,

        @NotBlank
        @Description("Last name of the applicant")
        String lastName,

        @NotBlank @Email
        @Description("Email address of the applicant")
        String email,

        @NotBlank
        @Description("Phone number of the applicant")
        String phone,

        @Embedded
        @NotNull
        @Description("Home address of the applicant")
        AdoptionRequest.Address address,

        // --- Household Information ---
        @Enumerated(EnumType.STRING) @NotNull
        @Description("Type of housing the applicant lives in")
        AdoptionRequest.HousingType housingType,

        @NotNull
        @Description("Whether the property has a yard")
        Boolean hasYard,

        @Description("Whether the yard is fenced (optional)")
        Boolean yardFenced,

        @Enumerated(EnumType.STRING) @NotNull
        @Description("Whether the applicant owns or rents the property")
        AdoptionRequest.OwnershipStatus ownOrRent,

        @Description("Whether the landlord approved pet ownership (optional)")
        Boolean landlordApproval,

        @Description("Contact information for the landlord (optional)")
        String landlordContact,

        @NotNull
        @Min(1)
        @Description("Number of people living in the household")
        Integer householdMembers,

        @Description("Ages of children in the household, if any")
        String childrenAges,

        // --- Lifestyle Information ---
        @NotNull
        @Max(18)
        @Min(0)
        @Description("Average hours per day the puppy would be left alone")
        @NotNull
        Integer hoursAlonePerDay,

        @Enumerated(EnumType.STRING) @NotNull
        @Description("General activity level of the household")
        AdoptionRequest.ActivityLevel activityLevel,

        @Description("Whether the applicant has previously owned pets")
        @NotNull
        Boolean previousPets,

        @Embedded
        @Description("Information about current pets (if any)")
        AdoptionRequest.CurrentPets currentPets,

        @Description("Permit number (required if pet permit is true)")
        @NotBlank
        @Length(min = 10, max = 10)
        String permitNumber,

        @Description("Permit expiry date (required if pet permit is true)")
        @NotNull
        @Future
        LocalDate permitExpiryDate) {

    public AdoptionForm(AdoptionRequest request) {
        this(
                request.firstName,
                request.lastName,
                request.email,
                request.phone,
                request.address,
                request.housingType,
                request.hasYard,
                request.yardFenced,
                request.ownOrRent,
                request.landlordApproval,
                request.landlordContact,
                request.householdMembers,
                request.childrenAges,
                request.hoursAlonePerDay,
                request.activityLevel,
                request.previousPets,
                request.currentPets,
                request.permitNumber,
                request.permitExpiryDate
        );
    }
}
