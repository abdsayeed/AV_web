import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help-form.component.html',
  styleUrls: ['./help-form.component.css']
})
export class HelpFormComponent {
  private router = inject(Router);

  helpForm = {
    subject: '',
    priority: 'medium',
    message: '',
    contactMethod: 'email'
  };

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  async submitHelpRequest() {
    if (this.isSubmitting) return;

    if (!this.helpForm.subject || !this.helpForm.message) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      // Simulate API call - replace with real API when backend is ready
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Help request submitted:', this.helpForm);
      
      this.successMessage = 'Your help request has been submitted successfully! We\'ll get back to you within 24 hours.';
      
      // Reset form
      this.helpForm = {
        subject: '',
        priority: 'medium',
        message: '',
        contactMethod: 'email'
      };

      // Clear success message after 5 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);

    } catch (error) {
      this.errorMessage = 'Failed to submit help request. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}