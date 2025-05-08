import {Puppy} from "./puppy";

export interface AdoptionForm {
  puppy:Puppy,
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };

  // Household Information
  housingType: 'house' | 'apartment' | 'condo' | 'other';
  hasYard: boolean;
  yardFenced?: boolean;
  ownOrRent: 'own' | 'rent';
  landlordApproval?: boolean;
  landlordContact?: string;
  householdMembers: number;
  childrenAges: string;

  // Lifestyle Information
  hoursAlonePerDay: number;
  activityLevel: 'low' | 'moderate' | 'high';
  previousPets: boolean;
  currentPets: {
    hasPets: boolean;
    petDetails?: string;
  };

  // Permit Information
  hasPetPermit: boolean;
  permitNumber?: string;
  permitExpiryDate?: string;

  // Agreement
  agreeToHomeVisit: boolean;
  agreeToTerms: boolean;
}
