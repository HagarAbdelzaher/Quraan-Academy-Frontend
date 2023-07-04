import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  role: string = '';
  param: string = '';
  imgSrc: string = '';
  header: string = '';
  error: string = '';
  isLoading: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(
    private _Router: Router,
    private _authService: AuthService,
    private _ActivatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe((params) => {
      const newRole = params['role'];

      if (!['admin', 'user'].includes(newRole)) {
        this._Router.navigate(['/notfound']);
      } else {
        this.param = newRole;
        this.setRoleProperties();
      }
    });
  }

  setRoleProperties() {
    if (this.param === 'admin') {
      this.role = 'admin';
      this.imgSrc = 'assets/bg/admin.jpg';
      this.header = 'Admin Panel';
    } else if (this.param === 'user') {
      this.role = 'student';
      this.imgSrc = 'assets/bg/register.jpg';
      this.header = 'Login';
    }
  }

  loginSubmit(login: FormGroup) {
    this.isLoading = true;

    this._authService.login(login.value, this.role).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this._authService.currentUser.next(
            this._authService.getDecodedToken()
          );
          if (this.role === 'admin') {
            this._Router.navigate(['/admin/courses/list']);
          } else {
            this._Router.navigate(['/home']);
          }
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.error = err.error.error;
        this.isLoading = false;
      },
    });
  }
}
