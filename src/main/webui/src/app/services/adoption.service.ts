import {inject, Injectable, signal} from '@angular/core';
import {AdoptionForm} from '../models/adoption-form';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {
  private adoptionFormData = signal<AdoptionForm | null>(null);
  private formSubmitted = signal<boolean>(false);

  private http = inject(HttpClient);

  saveFormData(formData: AdoptionForm) {
    this.adoptionFormData.set(formData);
    this.http.post('/api/adoption', formData).subscribe();
    this.formSubmitted.set(true);

    // In a real app, this would make an HTTP call to a backend service
    console.log('Form data saved:', formData);
  }

  getFormData() {
    return this.adoptionFormData;
  }

  isFormSubmitted() {
    return this.formSubmitted;
  }

  clearFormData() {
    this.adoptionFormData.set(null);
    this.formSubmitted.set(false);
  }
}
