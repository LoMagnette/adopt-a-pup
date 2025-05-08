package be.lomagnette.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class AdoptionRequest extends PanacheEntity {

    @OneToOne
    public Puppy puppy;

    // --- Personal Information ---
    public String firstName;
    public String lastName;
    public String email;
    public String phone;

    @Embedded
    public Address address;

    // --- Household Information ---
    @Enumerated(EnumType.STRING)
    public HousingType housingType;

    public boolean hasYard;
    public Boolean yardFenced; // Optional

    @Enumerated(EnumType.STRING)
    public OwnershipStatus ownOrRent;

    public Boolean landlordApproval; // Optional
    public String landlordContact;
    public int householdMembers;
    public String childrenAges;

    // --- Lifestyle Information ---
    public int hoursAlonePerDay;

    @Enumerated(EnumType.STRING)
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
    public boolean agreeToTerms;

    // --- Enums ---
    public enum HousingType { house, apartment, condo, other }
    public enum OwnershipStatus { own, rent }
    public enum ActivityLevel { low, moderate, high }

    // --- Embeddables ---
    @Embeddable
    public static class Address {
        public String street;
        public String city;
        public String state;
        public String zipCode;
    }

    @Embeddable
    public static class CurrentPets {
        public boolean hasPets;
        public String petDetails;
    }

}
