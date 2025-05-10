package be.lomagnette.entities;

import be.lomagnette.validations.ValidPermitInfo;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
@ValidPermitInfo
public class AdoptionRequest extends PanacheEntity {

    @OneToOne
    public Puppy puppy;

    // --- Personal Information ---
    @NotBlank
    public String firstName;
    @NotBlank
    public String lastName;
    @NotBlank
    @Email
    public String email;
    @NotBlank
    public String phone;

    @Embedded
    @NotNull
    public Address address;

    // --- Household Information ---
    @Enumerated(EnumType.STRING)
    @NotNull
    public HousingType housingType;

    @NotNull
    public boolean hasYard;
    public Boolean yardFenced; // Optional

    @Enumerated(EnumType.STRING)
    @NotNull
    public OwnershipStatus ownOrRent;

    public Boolean landlordApproval;// Optional
    public String landlordContact;
    @NotNull
    @Min(1)
    public int householdMembers;
    public String childrenAges;

    // --- Lifestyle Information ---
    @NotNull
    public int hoursAlonePerDay;

    @Enumerated(EnumType.STRING)
    @NotNull
    public ActivityLevel activityLevel;

    public boolean previousPets;

    @Embedded
    public CurrentPets currentPets;

    // --- Permit Information ---
    public boolean hasPetPermit;
    public String permitNumber;
    public LocalDate permitExpiryDate; // Changed to LocalDate

    // --- Agreement ---
    public boolean agreeToHomeVisit;
    @NotNull
    public boolean agreeToTerms;

    // --- Enums ---
    public enum HousingType { house, apartment, condo, other }
    public enum OwnershipStatus { own, rent }
    public enum ActivityLevel { low, moderate, high }

    // --- Embeddables ---
    @Embeddable
    public static class Address {
        @NotBlank
        public String street;
        @NotBlank
        public String city;
        public String state;
        @NotBlank
        public String zipCode;
    }

    @Embeddable
    public static class CurrentPets {
        public boolean hasPets;
        public String petDetails;
    }

}
