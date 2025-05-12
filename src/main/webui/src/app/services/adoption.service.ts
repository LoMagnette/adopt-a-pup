import {inject, Injectable, signal} from '@angular/core';
import {AdoptionForm} from '../models/adoption-form';
import {HttpClient} from "@angular/common/http";
import {Puppy} from "../models/puppy";

@Injectable({
    providedIn: 'root'
})
export class AdoptionService {
    private adoptionFormData = signal<AdoptionForm | null>(null);
    private formSubmitted = signal<boolean>(false);

    private http = inject(HttpClient);

    selectedPuppy = signal<Puppy | null>(null);
    adoptionForm = this.adoptionFormData.asReadonly();
    htmlContent = signal<string|undefined>(undefined);

    saveFormData(formData: AdoptionForm) {
        this.adoptionFormData.set(formData);
        this.http.post('/api/adoption', formData).subscribe();
        this.formSubmitted.set(true);
    }

    getFormData() {
        return this.adoptionFormData;
    }

    setFormData(form: AdoptionForm) {
        this.adoptionFormData.set(form);
        console.log('setFormData', this.adoptionFormData());
    }

    isFormSubmitted() {
        return this.formSubmitted;
    }

    clearFormData() {
        this.adoptionFormData.set(null);
        this.formSubmitted.set(false);
    }


    toWebForm(form: AdoptionForm|null) {
        if (form) {
            return {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                street: form.address?.street,
                city: form.address?.city,
                zipCode: form.address?.zipCode,
                housingType: form.housingType,
                hasYard: form.hasYard,
                yardFenced: form.yardFenced || null,
                ownOrRent: form.ownOrRent,
                landlordApproval: form.landlordApproval || null,
                landlordContact: form.landlordContact || null,
                householdMembers: form.householdMembers,
                childrenAges: form.childrenAges,
                hoursAlonePerDay: form.hoursAlonePerDay,
                activityLevel: form.activityLevel,
                previousPets: form.previousPets,
                hasPets: form.currentPets?.hasPets,
                petDetails: form.currentPets?.petDetails || null,
                permitNumber: form.permitNumber || null,
                permitExpiryDate: form.permitExpiryDate || null,
            }
        }
        return {};
    }

    getSummary(form:AdoptionForm){
        this.http.post<string>('/api/adoption/summary', form,{
            responseType: 'text' as 'json' // TypeScript workaround
        }).subscribe(response => {
            console.log('response', response);
            this.htmlContent.set(response);
        })
    }

    toAdoptionForm(form: any) :Partial<AdoptionForm> {
      if(!form) return {};
      const outputForm ={
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          zipCode: form.zipCode,
        },
        housingType: form.housingType,
        hasYard: form.hasYard,
        yardFenced: form.yardFenced,
        ownOrRent: form.ownOrRent,
        landlordApproval: form.landlordApproval,
        landlordContact: form.landlordContact,
        householdMembers: form.householdMembers,
        childrenAges: form.childrenAges,
        hoursAlonePerDay: form.hoursAlonePerDay,
        activityLevel: form.activityLevel,
        previousPets: form.previousPets,
        currentPets: {
          hasPets: form.hasPets,
          petDetails: form.petDetails,
        },
        permitNumber: form.permitNumber,
        permitExpiryDate: form.permitExpiryDate,
      }
      console.log('outputForm', outputForm, form);
      return outputForm;
    }
}
