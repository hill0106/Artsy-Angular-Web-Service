import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NavComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, NavComponent, FooterComponent, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent implements OnInit {
formData = {
  fullname: '',
  email: '',
  password: '',
};

backendErrors: any = {};
isLoading = false;

constructor(private authService: AuthService, private router: Router) {}

ngOnInit(): void {
  this.authService.initializeUser();
}
onSubmit(registerForm: any) {
  this.isLoading = true;
  if (registerForm.valid) {
    this.authService.login({ email: this.formData.email, password: this.formData.password })
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            // console.log('Logged in successfully:', res);
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.isLoading = false;
            // console.error('Login failed:', err);
            this.backendErrors.general = 'Password or email is incorrect.';
          }
    });
    // registerForm.reset();
    
  }
  this.backendErrors = {};

  
}
}
