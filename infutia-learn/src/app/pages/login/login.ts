import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'il-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly mode = signal<'signin' | 'signup'>('signin');
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly showPassword = signal(false);
  readonly submitting = signal(false);

  readonly signinForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true],
  });

  readonly signupForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    terms: [false, Validators.requiredTrue],
  });

  invalid(controlName: string): boolean {
    const form = this.mode() === 'signin' ? this.signinForm : this.signupForm;
    const c = form.get(controlName);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  switchMode(mode: 'signin' | 'signup'): void {
    this.mode.set(mode);
    this.error.set(null);
    this.notice.set(null);
  }

  constructor() {
    // Deep link support: /login?mode=signup opens the author sign-up tab.
    const q = new URLSearchParams(window.location.search).get('mode');
    if (q === 'signup') this.mode.set('signup');
  }

  useDemo(): void {
    this.signinForm.patchValue({
      email: AuthService.DEMO.email,
      password: AuthService.DEMO.password,
    });
    this.signinForm.markAllAsTouched();
  }

  submit(): void {
    this.error.set(null);
    if (this.mode() === 'signin') {
      if (this.signinForm.invalid) {
        this.signinForm.markAllAsTouched();
        return;
      }
      this.submitting.set(true);
      const { email, password } = this.signinForm.value;
      const res = this.auth.login(email, password);
      this.submitting.set(false);
      if (res.ok) {
        // Return the author to wherever the guard bounced them from (e.g. /studio).
        let target = '/studio';
        try {
          const saved = sessionStorage.getItem('infutia-redirect');
          if (saved) {
            target = saved;
            sessionStorage.removeItem('infutia-redirect');
          }
        } catch {
          /* SSR-safe */
        }
        this.router.navigate([target]);
      } else {
        this.error.set(res.error ?? 'Something went wrong. Please try again.');
      }
    } else {
      if (this.signupForm.invalid) {
        this.signupForm.markAllAsTouched();
        if (this.signupForm.get('terms')?.invalid) {
          this.error.set('Please accept the Author Terms to continue.');
        }
        return;
      }
      this.submitting.set(true);
      const res = this.auth.register(this.signupForm.value);
      this.submitting.set(false);
      if (res.ok) this.router.navigate(['/become-author']);
      else this.error.set(res.error ?? 'Could not create your account.');
    }
  }

  forgot(): void {
    const email = this.signinForm.get('email')?.value;
    this.notice.set(
      email
        ? `We've sent a reset link to ${email}. Check your inbox (and spam folder, just in case).`
        : 'Enter your email above first, then we will send you a reset link.'
    );
  }
}
