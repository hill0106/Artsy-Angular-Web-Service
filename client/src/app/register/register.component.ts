import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, NavComponent, FooterComponent, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  formData = {
    name: '',
    email: '',
    password: '',
  };

  backendErrors: any = {};
  registrationSuccess = false;
  errorMessage = '';
  isLoading = false;
  isAuthenticated$!: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.authService.initializeUser();
  }

  onSubmit(registerForm: any) {
    this.isLoading = true;
    if (registerForm.valid) {
      this.authService.register(this.formData).subscribe({
        next: (response) => {
          // console.log('Registration successful:', response);
          this.registrationSuccess = true;
          this.errorMessage = '';
          this.formData = {
            name: '',
            email: '',
            password: '',
          };
          registerForm.resetForm();
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          if (err.status === 400) {
            this.errorMessage = 'Password does not meet the requirements.';
          } 
          else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
          this.registrationSuccess = false;
          this.isLoading = false;
        }
      });
    } 

    this.backendErrors = {};
  }

  checkEmail(email: string): void {
    if (email) {
      this.authService.checkEmailExists(email).subscribe({
        next: (exists) => {
          if (exists) {
            this.backendErrors.email = 'User with this email already exists.';
          } else {
            this.backendErrors.email = '';
          }
        },
        error: (err) => {
          console.error('Error checking email:', err);
        }
      });
    }
  }

  clearEmailError(): void {
    if (this.backendErrors.email) {
      this.backendErrors.email = '';
    }
  }


}
