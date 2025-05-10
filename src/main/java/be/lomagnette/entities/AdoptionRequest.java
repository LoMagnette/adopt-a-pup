package be.lomagnette.entities;

import be.lomagnette.validations.ValidPermitInfo;
import dev.langchain4j.model.output.structured.Description;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;

@Entity
@ValidPermitInfo
public class AdoptionRequest extends PanacheEntity {

    @OneToOne
    @Description("The puppy being adopted")
    public Puppy puppy;

    // --- Personal Information ---
    @NotBlank
    @Description("First name of the applicant")
    public String firstName;

    @NotBlank
    @Description("Last name of the applicant")
    public String lastName;

    @NotBlank @Email
    @Description("Email address of the applicant")
    public String email;

    @NotBlank
    @Description("Phone number of the applicant")
    public String phone;

    @Embedded @NotNull
    @Description("Home address of the applicant")
    public Address address;

    // --- Household Information ---
    @Enumerated(EnumType.STRING) @NotNull
    @Description("Type of housing the applicant lives in")
    public HousingType housingType;

    @NotNull
    @Description("Whether the property has a yard")
    public Boolean hasYard;

    @Description("Whether the yard is fenced (optional)")
    public Boolean yardFenced;

    @Enumerated(EnumType.STRING) @NotNull
    @Description("Whether the applicant owns or rents the property")
    public OwnershipStatus ownOrRent;

    @Description("Whether the landlord approved pet ownership (optional)")
    public Boolean landlordApproval;

    @Description("Contact information for the landlord (optional)")
    public String landlordContact;

    @NotNull
    @Min(1)
    @Description("Number of people living in the household")
    public Integer householdMembers;

    @Description("Ages of children in the household, if any")
    public String childrenAges;

    // --- Lifestyle Information ---
    @NotNull
    @Max(18)
    @Min(0)
    @Description("Average hours per day the puppy would be left alone")
    @NotNull
    public Integer hoursAlonePerDay;

    @Enumerated(EnumType.STRING) @NotNull
    @Description("General activity level of the household")
    public ActivityLevel activityLevel;

    @Description("Whether the applicant has previously owned pets")
    @NotNull
    public Boolean previousPets;

    @Embedded
    @Description("Information about current pets (if any)")
    public CurrentPets currentPets;

    // --- Permit Information ---
    @Description("Indicates whether the applicant has a pet permit")
    @AssertTrue(message = "Pet permit is required if the applicant has pets")
    public boolean hasPetPermit;

    @Description("Permit number (required if pet permit is true)")
    @NotBlank
    @Length(min = 10, max = 10)
    public String permitNumber;

    @Description("Permit expiry date (required if pet permit is true)")
    @NotNull
    @Future
    public LocalDate permitExpiryDate;

    // --- Agreement ---
    public boolean agreeToHomeVisit;

    public boolean agreeToTerms;


    // --- Enums ---
    public enum HousingType { house, apartment, condo, other }
    public enum OwnershipStatus { own, rent }
    public enum ActivityLevel { low, moderate, high }

    // --- Embeddables ---
    @Embeddable
    public static record Address (
        @NotBlank
        String street,
        @NotBlank
        String city,
        @NotBlank
        @Length(min = 4, max = 4)
        String zipCode
    ){
    }

    @Embeddable
    public static record CurrentPets (
        boolean hasPets,
        String petDetails
    ){
    }

    public Puppy getPuppy() {
        return puppy;
    }

    public void setPuppy(Puppy puppy) {
        this.puppy = puppy;
    }

    @Override
    public String toString() {
        return "AdoptionRequest{" +
                "puppy=" + puppy +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", address=" + address +
                ", housingType=" + housingType +
                ", hasYard=" + hasYard +
                ", yardFenced=" + yardFenced +
                ", ownOrRent=" + ownOrRent +
                ", landlordApproval=" + landlordApproval +
                ", landlordContact='" + landlordContact + '\'' +
                ", householdMembers=" + householdMembers +
                ", childrenAges='" + childrenAges + '\'' +
                ", hoursAlonePerDay=" + hoursAlonePerDay +
                ", activityLevel=" + activityLevel +
                ", previousPets=" + previousPets +
                ", currentPets=" + currentPets +
                ", hasPetPermit=" + hasPetPermit +
                ", permitNumber='" + permitNumber + '\'' +
                ", permitExpiryDate=" + permitExpiryDate +
                ", agreeToHomeVisit=" + agreeToHomeVisit +
                ", agreeToTerms=" + agreeToTerms +
                '}';
    }
}
