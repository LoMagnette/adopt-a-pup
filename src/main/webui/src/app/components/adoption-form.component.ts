import {Component, effect, inject, input, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AdoptionService} from '../services/adoption.service';
import {AdoptionForm} from '../models/adoption-form';
import {PuppyService} from "../services/puppy.service";


@Component({
    selector: 'app-adoption-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    template: `
        <div class="adoption-form-container">
            <h1 class="form-title">Puppy Adoption Application</h1>
            <p class="form-description">Please fill out this form completely to help us match you with the perfect
                puppy.</p>

            <form [formGroup]="adoptionForm" (ngSubmit)="onSubmit()">
                <!-- Progress Indicator -->
                <div class="progress-container">
                    <div class="progress-item" [class.active]="currentStep() >= 1" (click)="goToStep(1)">Personal Info
                    </div>
                    <div class="progress-item" [class.active]="currentStep() >= 2" (click)="goToStep(2)">Household</div>
                    <div class="progress-item" [class.active]="currentStep() >= 3" (click)="goToStep(3)">Lifestyle</div>
                    <div class="progress-item" [class.active]="currentStep() >= 4" (click)="goToStep(4)">Preferences
                    </div>
                    <div class="progress-item" [class.active]="currentStep() >= 5" (click)="goToStep(5)">Permit</div>
                    <div class="progress-item" [class.active]="currentStep() >= 6" (click)="goToStep(6)">Agreement</div>
                </div>

                @if (currentStep() === 1) {
                    <div class="form-section">
                        <h2>Personal Information</h2>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">First Name *</label>
                                <input id="firstName" type="text" formControlName="firstName">
                                @if (adoptionForm.get('firstName')?.invalid && adoptionForm.get('firstName')?.touched) {
                                    <div class="error-message">First name is required</div>
                                }
                            </div>

                            <div class="form-group">
                                <label for="lastName">Last Name *</label>
                                <input id="lastName" type="text" formControlName="lastName">
                                @if (adoptionForm.get('lastName')?.invalid && adoptionForm.get('lastName')?.touched) {
                                    <div class="error-message">Last name is required</div>
                                }
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="email">Email *</label>
                                <input id="email" type="email" formControlName="email">
                                @if (adoptionForm.get('email')?.invalid && adoptionForm.get('email')?.touched) {
                                    <div class="error-message">Please enter a valid email</div>
                                }
                            </div>

                            <div class="form-group">
                                <label for="phone">Phone Number *</label>
                                <input id="phone" type="tel" formControlName="phone">
                                @if (adoptionForm.get('phone')?.invalid && adoptionForm.get('phone')?.touched) {
                                    <div class="error-message">Please enter a valid phone number</div>
                                }
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="street">Street Address *</label>
                            <input id="street" type="text" formControlName="street">
                            @if (adoptionForm.get('street')?.invalid && adoptionForm.get('street')?.touched) {
                                <div class="error-message">Street address is required</div>
                            }
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="city">City *</label>
                                <input id="city" type="text" formControlName="city">
                                @if (adoptionForm.get('city')?.invalid && adoptionForm.get('city')?.touched) {
                                    <div class="error-message">City is required</div>
                                }
                            </div>

                            <div class="form-group">
                                <label for="zipCode">Zip Code *</label>
                                <input id="zipCode" type="text" formControlName="zipCode">
                                @if (adoptionForm.get('zipCode')?.invalid && adoptionForm.get('zipCode')?.touched) {
                                    <div class="error-message">Valid zip code is required</div>
                                }
                            </div>
                        </div>
                    </div>
                }

                @if (currentStep() === 2) {
                    <div class="form-section">
                        <h2>Household Information</h2>

                        <div class="form-group">
                            <label for="housingType">Housing Type *</label>
                            <select id="housingType" formControlName="housingType">
                                <option value="" disabled selected>Select housing type</option>
                                <option value="house">house</option>
                                <option value="apartment">apartment</option>
                                <option value="condo">condo</option>
                                <option value="other">other</option>
                            </select>
                            @if (adoptionForm.get('housingType')?.invalid && adoptionForm.get('housingType')?.touched) {
                                <div class="error-message">Please select your housing type</div>
                            }
                        </div>

                        <div class="form-group checkbox-group">
                            <input id="hasYard" type="checkbox" formControlName="hasYard">
                            <label for="hasYard">Do you have a yard?</label>
                        </div>

                        @if (adoptionForm.get('hasYard')?.value) {
                            <div class="form-group checkbox-group indent">
                                <input id="yardFenced" type="checkbox" formControlName="yardFenced">
                                <label for="yardFenced">Is your yard fenced?</label>
                            </div>
                        }

                        <div class="form-group">
                            <label for="ownOrRent">Do you own or rent your home? *</label>
                            <select id="ownOrRent" formControlName="ownOrRent">
                                <option value="" disabled selected>Select option</option>
                                <option value="own">own</option>
                                <option value="rent">rent</option>
                            </select>
                            @if (adoptionForm.get('ownOrRent')?.invalid && adoptionForm.get('ownOrRent')?.touched) {
                                <div class="error-message">Please select if you own or rent</div>
                            }
                        </div>

                        @if (adoptionForm.get('ownOrRent')?.value === 'rent') {
                            <div class="form-group checkbox-group indent">
                                <input id="landlordApproval" type="checkbox" formControlName="landlordApproval">
                                <label for="landlordApproval">Do you have landlord approval for pets? *</label>
                                @if (adoptionForm.get('landlordApproval')?.invalid && adoptionForm.get('landlordApproval')?.touched) {
                                    <div class="error-message">Landlord approval is required</div>
                                }
                            </div>

                            <div class="form-group indent">
                                <label for="landlordContact">Landlord Contact Information *</label>
                                <input id="landlordContact" type="text" formControlName="landlordContact">
                                @if (adoptionForm.get('landlordContact')?.invalid && adoptionForm.get('landlordContact')?.touched) {
                                    <div class="error-message">Landlord contact information is required</div>
                                }
                            </div>
                        }

                        <div class="form-group">
                            <label for="householdMembers">Number of people in household *</label>
                            <input id="householdMembers" type="number" min="1" formControlName="householdMembers">
                            @if (adoptionForm.get('householdMembers')?.invalid && adoptionForm.get('householdMembers')?.touched) {
                                <div class="error-message">Please enter a valid number</div>
                            }
                        </div>

                        <div class="form-group">
                            <label for="childrenAges">Ages of children in household (if any)</label>
                            <input id="childrenAges" type="text" formControlName="childrenAges"
                                   placeholder="e.g., 5, 8, 12">
                        </div>
                    </div>
                }

                @if (currentStep() === 3) {
                    <div class="form-section">
                        <h2>Lifestyle Information</h2>

                        <div class="form-group">
                            <label for="hoursAlonePerDay">How many hours will the puppy be alone per day? *</label>
                            <input id="hoursAlonePerDay" type="number" min="0" max="24"
                                   formControlName="hoursAlonePerDay">
                            @if (adoptionForm.get('hoursAlonePerDay')?.invalid && adoptionForm.get('hoursAlonePerDay')?.touched) {
                                <div class="error-message">Please enter a valid number between 0 and 24</div>
                            }
                        </div>

                        <div class="form-group">
                            <label for="activityLevel">Your activity level *</label>
                            <select id="activityLevel" formControlName="activityLevel">
                                <option value="" disabled selected>Select activity level</option>
                                <option value="low">Low (short walks only)</option>
                                <option value="moderate">Moderate (daily walks, occasional play)</option>
                                <option value="high">High (daily runs/hikes, active play)</option>
                            </select>
                            @if (adoptionForm.get('activityLevel')?.invalid && adoptionForm.get('activityLevel')?.touched) {
                                <div class="error-message">Please select your activity level</div>
                            }
                        </div>

                        <div class="form-group checkbox-group">
                            <input id="previousPets" type="checkbox" formControlName="previousPets">
                            <label for="previousPets">Have you had pets before?</label>
                        </div>

                        <div class="form-group checkbox-group">
                            <input id="hasPets" type="checkbox" formControlName="hasPets">
                            <label for="hasPets">Do you currently have other pets?</label>
                        </div>

                        @if (adoptionForm.get('hasPets')?.value) {
                            <div class="form-group indent">
                                <label for="petDetails">Please describe your current pets (species, breeds, ages)
                                    *</label>
                                <textarea id="petDetails" formControlName="petDetails" rows="3"></textarea>
                                @if (adoptionForm.get('petDetails')?.invalid && adoptionForm.get('petDetails')?.touched) {
                                    <div class="error-message">Please provide details about your current pets</div>
                                }
                            </div>
                        }
                    </div>
                }


                @if (currentStep() === 4) {
                    <div class="form-section">
                        <h2>Permit Information</h2>

                        <div class="form-group checkbox-group">
                            <input id="hasPetPermit" type="checkbox" formControlName="hasPetPermit">
                            <label for="hasPetPermit">Do you have a pet permit or license?</label>
                        </div>

                        @if (adoptionForm.get('hasPetPermit')?.value) {
                            <div class="form-group indent">
                                <label for="permitNumber">Permit/License Number *</label>
                                <input id="permitNumber" type="text" formControlName="permitNumber">
                                @if (adoptionForm.get('permitNumber')?.invalid && adoptionForm.get('permitNumber')?.touched) {
                                    <div class="error-message">Permit number is required</div>
                                }
                            </div>

                            <div class="form-group indent">
                                <label for="permitExpiryDate">Permit/License Expiry Date *</label>
                                <input id="permitExpiryDate" type="date" formControlName="permitExpiryDate">
                                @if (adoptionForm.get('permitExpiryDate')?.invalid && adoptionForm.get('permitExpiryDate')?.touched) {
                                    <div class="error-message">Valid expiry date is required</div>
                                }
                            </div>
                        }
                    </div>
                }

                @if (currentStep() === 5) {
                    <div class="form-section">
                        <h2>Agreement</h2>

                        <div class="form-group checkbox-group">
                            <input id="agreeToHomeVisit" type="checkbox" formControlName="agreeToHomeVisit">
                            <label for="agreeToHomeVisit">I agree to a home visit prior to adoption *</label>
                            @if (adoptionForm.get('agreeToHomeVisit')?.invalid && adoptionForm.get('agreeToHomeVisit')?.touched) {
                                <div class="error-message">You must agree to a home visit</div>
                            }
                        </div>

                        <div class="form-group checkbox-group">
                            <input id="agreeToTerms" type="checkbox" formControlName="agreeToTerms">
                            <label for="agreeToTerms">I agree to the terms and conditions of adoption *</label>
                            @if (adoptionForm.get('agreeToTerms')?.invalid && adoptionForm.get('agreeToTerms')?.touched) {
                                <div class="error-message">You must agree to the terms</div>
                            }
                        </div>

                        <div class="terms-container">
                            <h3>Terms and Conditions</h3>
                            <p>By agreeing to these terms, you acknowledge that:</p>
                            <ul>
                                <li>All information provided is truthful and accurate.</li>
                                <li>The adoption agency reserves the right to deny any application.</li>
                                <li>A home check will be conducted prior to final approval.</li>
                                <li>You will provide proper care, food, shelter, and veterinary care for the adopted
                                    puppy.
                                </li>
                                <li>If you can no longer care for the adopted puppy, you will return them to the
                                    agency.
                                </li>
                                <li>Adoption fees are non-refundable after the adoption is finalized.</li>
                            </ul>
                        </div>
                    </div>

                    <div class="form-summary">
                        <h3>Application Summary</h3>
                        <p>Please review your information before submitting:</p>

                        <div class="summary-section">
                            <h4>Personal Information</h4>
                            <p>
                                <strong>Name:</strong> {{ adoptionForm.get('firstName')?.value }} {{ adoptionForm.get('lastName')?.value }}
                            </p>
                            <p><strong>Contact:</strong> {{ adoptionForm.get('email')?.value }}
                                | {{ adoptionForm.get('phone')?.value }}</p>
                            <p><strong>Address:</strong> {{ adoptionForm.get('street')?.value }}
                                , {{ adoptionForm.get('city')?.value }}
                                , {{ adoptionForm.get('state')?.value }} {{ adoptionForm.get('zipCode')?.value }}</p>
                        </div>

                        <div class="summary-section">
                            <h4>Household Information</h4>
                            <p><strong>Housing:</strong> {{ adoptionForm.get('housingType')?.value }}
                                ({{ adoptionForm.get('ownOrRent')?.value === 'own' ? 'Owner' : 'Renter' }})</p>
                            <p>
                                <strong>Yard:</strong> {{ adoptionForm.get('hasYard')?.value ? 'Yes' : 'No' }}{{ adoptionForm.get('hasYard')?.value && adoptionForm.get('yardFenced')?.value ? ' (Fenced)' : '' }}
                            </p>
                            <p><strong>Household members:</strong> {{ adoptionForm.get('householdMembers')?.value }}</p>
                            @if (adoptionForm.get('childrenAges')?.value) {
                                <p><strong>Children ages:</strong> {{ adoptionForm.get('childrenAges')?.value }}</p>
                            }
                        </div>

                        <div class="summary-section">
                            <h4>Lifestyle Information</h4>
                            <p><strong>Activity level:</strong> {{ adoptionForm.get('activityLevel')?.value }}</p>
                            <p><strong>Hours puppy will be alone
                                daily:</strong> {{ adoptionForm.get('hoursAlonePerDay')?.value }}</p>
                            <p><strong>Previous pet
                                experience:</strong> {{ adoptionForm.get('previousPets')?.value ? 'Yes' : 'No' }}</p>
                            <p><strong>Current pets:</strong> {{ adoptionForm.get('hasPets')?.value ? 'Yes' : 'No' }}
                            </p>
                            @if (adoptionForm.get('hasPets')?.value && adoptionForm.get('petDetails')?.value) {
                                <p><strong>Pet details:</strong> {{ adoptionForm.get('petDetails')?.value }}</p>
                            }
                        </div>

                        @if (adoptionForm.get('hasPetPermit')?.value) {
                            <div class="summary-section">
                                <h4>Permit Information</h4>
                                <p><strong>Permit number:</strong> {{ adoptionForm.get('permitNumber')?.value }}</p>
                                <p><strong>Expiry date:</strong> {{ adoptionForm.get('permitExpiryDate')?.value }}</p>
                            </div>
                        }
                    </div>
                }

                <div class="form-navigation">
                    @if (currentStep() > 1) {
                        <button type="button" class="back-button" (click)="previousStep()">Back</button>
                    }

                    @if (currentStep() < 5) {
                        <button type="button" class="next-button" (click)="nextStep()"
                                [disabled]="(!isCurrentStepValid() && currentStep()===4)">Next
                        </button>
                    } @else {
                        <button type="submit" class="submit-button" [disabled]="!adoptionForm.valid">Submit
                            Application
                        </button>
                    }
                </div>
            </form>
        </div>
    `,
    styles: `
      .adoption-form-container {
        max-width: 900px;
        margin: 2rem auto;
        padding: 2rem;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .form-title {
        color: #2c3e50;
        text-align: center;
        margin-bottom: 0.5rem;
      }

      .form-description {
        color: #7f8c8d;
        text-align: center;
        margin-bottom: 2rem;
      }

      .progress-container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        position: relative;
      }

      .progress-container::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 2px;
        background-color: #ddd;
        z-index: 1;
      }

      .progress-item {
        position: relative;
        background-color: #ddd;
        color: #fff;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        z-index: 2;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .progress-item.active {
        background-color: #3498db;
      }

      .form-section {
        margin-bottom: 2rem;
      }

      .form-section h2 {
        color: #2c3e50;
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #3498db;
      }

      .form-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .form-group {
        margin-bottom: 1rem;
        flex: 1;
      }

      .form-group.indent {
        margin-left: 2rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #34495e;
        font-weight: 500;
      }

      input[type="text"],
      input[type="email"],
      input[type="tel"],
      input[type="number"],
      input[type="date"],
      select,
      textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      .checkbox-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .checkbox-group input[type="checkbox"] {
        width: 20px;
        height: 20px;
      }

      .checkbox-group label {
        margin-bottom: 0;
      }

      .error-message {
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 0.25rem;
      }

      .form-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
      }

      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .back-button {
        background-color: #95a5a6;
        color: white;
      }

      .back-button:hover {
        background-color: #7f8c8d;
      }

      .next-button {
        background-color: #3498db;
        color: white;
      }

      .next-button:hover {
        background-color: #2980b9;
      }

      .submit-button {
        background-color: #2ecc71;
        color: white;
      }

      .submit-button:hover {
        background-color: #27ae60;
      }

      button:disabled {
        background-color: #ddd;
        cursor: not-allowed;
      }

      .terms-container {
        background-color: #ecf0f1;
        padding: 1.5rem;
        border-radius: 4px;
        margin: 1.5rem 0;
      }

      .terms-container h3 {
        margin-top: 0;
        color: #2c3e50;
      }

      .terms-container ul {
        padding-left: 1.5rem;
      }

      .form-summary {
        margin-top: 2rem;
        background-color: #ecf0f1;
        padding: 1.5rem;
        border-radius: 4px;
      }

      .summary-section {
        margin-bottom: 1.5rem;
      }

      .summary-section h4 {
        color: #3498db;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid #ddd;
        padding-bottom: 0.25rem;
      }

      .summary-section p {
        margin: 0.5rem 0;
      }
    `
})
export class AdoptionFormComponent {
    private adoptionService: AdoptionService = inject(AdoptionService);
    private router = inject(Router);

    private puppyService: PuppyService = inject(PuppyService);


    id = input.required<string>();

    breeds = signal([]);
    currentStep = signal<number>(1);

    adoptionForm = new FormGroup({
        // Personal Info
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        phone: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{4}')]),

        // Household Info
        housingType: new FormControl('', [Validators.required]),
        hasYard: new FormControl(false),
        yardFenced: new FormControl(false),
        ownOrRent: new FormControl('', [Validators.required]),
        landlordApproval: new FormControl(false),
        landlordContact: new FormControl(''),
        householdMembers: new FormControl(1, [Validators.required, Validators.min(1)]),
        childrenAges: new FormControl(''),

        // Lifestyle Info
        hoursAlonePerDay: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(24)]),
        activityLevel: new FormControl('', [Validators.required]),
        previousPets: new FormControl(false),
        hasPets: new FormControl(false),
        petDetails: new FormControl(''),

        // Permit Info
        hasPetPermit: new FormControl(false),
        permitNumber: new FormControl(''),
        permitExpiryDate: new FormControl(''),

        // Agreement
        agreeToHomeVisit: new FormControl(false, [Validators.requiredTrue]),
        agreeToTerms: new FormControl(false, [Validators.requiredTrue])
    });


    constructor() {
        effect(() => {
            const idNbr = Number.parseInt(this.id());
            this.puppyService.getPuppyById(idNbr).subscribe(
                value => this.adoptionService.selectedPuppy.set(value)
            );
        });
        effect(() => {
            const form = this.adoptionService.adoptionForm();
            this.adoptionForm.reset(this.adoptionService.toWebForm(form));
        })
    }

    ngOnInit() {
        // Add conditional validation based on form values
        this.adoptionForm.get('hasYard')?.valueChanges.subscribe(hasYard => {
            if (!hasYard) {
                this.adoptionForm.get('yardFenced')?.setValue(false);
            }
        });

        this.adoptionForm.get('ownOrRent')?.valueChanges.subscribe(value => {
            if (value === 'rent') {
                this.adoptionForm.get('landlordApproval')?.addValidators(Validators.requiredTrue);
                this.adoptionForm.get('landlordContact')?.addValidators(Validators.required);
            } else {
                this.adoptionForm.get('landlordApproval')?.clearValidators();
                this.adoptionForm.get('landlordContact')?.clearValidators();
                this.adoptionForm.get('landlordApproval')?.setValue(false);
                this.adoptionForm.get('landlordContact')?.setValue('');
            }
            this.adoptionForm.get('landlordApproval')?.updateValueAndValidity();
            this.adoptionForm.get('landlordContact')?.updateValueAndValidity();
        });

        this.adoptionForm.get('hasPets')?.valueChanges.subscribe(hasPets => {
            if (hasPets) {
                this.adoptionForm.get('petDetails')?.addValidators(Validators.required);
            } else {
                this.adoptionForm.get('petDetails')?.clearValidators();
                this.adoptionForm.get('petDetails')?.setValue('');
            }
            this.adoptionForm.get('petDetails')?.updateValueAndValidity();
        });

        this.adoptionForm.get('hasPetPermit')?.valueChanges.subscribe(hasPetPermit => {
            if (hasPetPermit) {
                this.adoptionForm.get('permitNumber')?.addValidators(Validators.required);
                this.adoptionForm.get('permitExpiryDate')?.addValidators(Validators.required);
            } else {
                this.adoptionForm.get('permitNumber')?.clearValidators();
                this.adoptionForm.get('permitExpiryDate')?.clearValidators();
                this.adoptionForm.get('permitNumber')?.setValue('');
                this.adoptionForm.get('permitExpiryDate')?.setValue('');
            }
            this.adoptionForm.get('permitNumber')?.updateValueAndValidity();
            this.adoptionForm.get('permitExpiryDate')?.updateValueAndValidity();
        });
    }

    nextStep() {
        if (this.isCurrentStepValid() || this.currentStep() <4 ) {
            this.currentStep.update(step => step + 1);
            window.scrollTo(0, 0);
        }
    }

    previousStep() {
        this.currentStep.update(step => Math.max(1, step - 1));
        window.scrollTo(0, 0);
    }

    goToStep(step: number) {
        // Only allow going to a step if all previous steps are valid
        if (step < this.currentStep() || this.areAllPreviousStepsValid(step)) {
            this.currentStep.set(step);
            window.scrollTo(0, 0);
        }
    }

    isCurrentStepValid(): boolean | undefined {
        const step = this.currentStep();

        if (step === 1) {
            return (
                this.adoptionForm.get('firstName')?.valid &&
                this.adoptionForm.get('lastName')?.valid &&
                this.adoptionForm.get('email')?.valid &&
                this.adoptionForm.get('phone')?.valid &&
                this.adoptionForm.get('street')?.valid &&
                this.adoptionForm.get('city')?.valid &&
                this.adoptionForm.get('state')?.valid &&
                this.adoptionForm.get('zipCode')?.valid
            ) || false;
        } else if (step === 2) {
            const basic = this.adoptionForm.get('housingType')?.valid &&
                this.adoptionForm.get('ownOrRent')?.valid &&
                this.adoptionForm.get('householdMembers')?.valid;

            // Additional validation for renters
            if (this.adoptionForm.get('ownOrRent')?.value === 'rent') {
                return basic &&
                    this.adoptionForm.get('landlordApproval')?.valid &&
                    this.adoptionForm.get('landlordContact')?.valid;
            }

            return basic;
        } else if (step === 3) {
            const basic = this.adoptionForm.get('hoursAlonePerDay')?.valid &&
                this.adoptionForm.get('activityLevel')?.valid;

            // Additional validation for pet owners
            if (this.adoptionForm.get('hasPets')?.value) {
                return basic && this.adoptionForm.get('petDetails')?.valid;
            }

            return basic;
        } else if (step === 4) {
            // If they have a permit, validate permit fields
            if (this.adoptionForm.get('hasPetPermit')?.value) {
                return this.adoptionForm.get('permitNumber')?.valid &&
                    this.adoptionForm.get('permitExpiryDate')?.valid;
            }

            return true;
        } else if (step === 5) {
            return this.adoptionForm.get('agreeToHomeVisit')?.valid &&
                this.adoptionForm.get('agreeToTerms')?.valid;
        }

        return false;
    }

    areAllPreviousStepsValid(step: number): boolean {
        const currentStep = this.currentStep();

        // Save current step
        const temp = currentStep;

        // Check all steps up to the target step
        let allValid = true;
        for (let i = 1; i < step; i++) {
            this.currentStep.set(i);
            if (!this.isCurrentStepValid()) {
                allValid = false;
                break;
            }
        }

        // Restore current step
        this.currentStep.set(temp);

        return allValid;
    }

    onSubmit() {
        if (this.adoptionForm.valid) {
            this.submitAdoption();
        }
    }

    submitAdoption() {
        if (!this.adoptionService.selectedPuppy()) return;
        const formData: AdoptionForm = {
            puppy: this.adoptionService.selectedPuppy()!,
            firstName: this.adoptionForm.get('firstName')?.value || '',
            lastName: this.adoptionForm.get('lastName')?.value || '',
            email: this.adoptionForm.get('email')?.value || '',
            phone: this.adoptionForm.get('phone')?.value || '',
            address: {
                street: this.adoptionForm.get('street')?.value || '',
                city: this.adoptionForm.get('city')?.value || '',
                zipCode: this.adoptionForm.get('zipCode')?.value || ''
            },
            housingType: this.adoptionForm.get('housingType')?.value as any || 'house',
            hasYard: !!this.adoptionForm.get('hasYard')?.value,
            yardFenced: !!this.adoptionForm.get('yardFenced')?.value,
            ownOrRent: this.adoptionForm.get('ownOrRent')?.value as any || 'own',
            landlordApproval: !!this.adoptionForm.get('landlordApproval')?.value,
            landlordContact: this.adoptionForm.get('landlordContact')?.value || undefined,
            householdMembers: Number(this.adoptionForm.get('householdMembers')?.value || 1),
            childrenAges: this.adoptionForm.get('childrenAges')?.value || '',
            hoursAlonePerDay: Number(this.adoptionForm.get('hoursAlonePerDay')?.value || 0),
            activityLevel: this.adoptionForm.get('activityLevel')?.value as any || 'moderate',
            previousPets: !!this.adoptionForm.get('previousPets')?.value,
            currentPets: {
                hasPets: !!this.adoptionForm.get('hasPets')?.value,
                petDetails: this.adoptionForm.get('petDetails')?.value || undefined
            },
            hasPetPermit: !!this.adoptionForm.get('hasPetPermit')?.value,
            permitNumber: this.adoptionForm.get('permitNumber')?.value || undefined,
            permitExpiryDate: this.adoptionForm.get('permitExpiryDate')?.value || undefined,
            agreeToHomeVisit: !!this.adoptionForm.get('agreeToHomeVisit')?.value,
            agreeToTerms: !!this.adoptionForm.get('agreeToTerms')?.value
        };

        // Save form data to the service
        this.adoptionService.saveFormData(formData);

        // Navigate to success page
        this.router.navigate(['/success']);
    }
}

