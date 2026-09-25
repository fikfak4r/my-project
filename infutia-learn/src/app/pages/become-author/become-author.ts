import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../shared/reveal/reveal';

@Component({
  selector: 'app-become-author',
  imports: [FormsModule, RouterLink, Reveal],
  templateUrl: './become-author.html',
  styleUrl: './become-author.scss',
})
export class BecomeAuthor {
  form: WritableSignal<{ name: string; email: string; focus: string }> = signal({ name: '', email: '', focus: '' });
  submitted = signal(false);

  perks = [
    { icon: 'bi-file-earmark-arrow-up', title: 'PDF & Word import', text: 'Upload what you already have — we convert it into Infutia Markdown with chapters intact.' },
    { icon: 'bi-shield-lock', title: 'Anti-piracy by design', text: 'No downloadable files means no forwarded PDFs. Your work streams inside the premium reader.' },
    { icon: 'bi-shop', title: 'Zero website stress', text: 'Hosting, themes, checkout pages — gone. Publish and your storefront exists instantly.' },
    { icon: 'bi-people', title: 'Followers & community', text: 'Readers follow you, get launch pings, and engage chapter by chapter.' },
    { icon: 'bi-eye', title: 'Private until you publish', text: 'Your profile stays invisible until your first product goes live. Then you choose to go public.' },
    { icon: 'bi-currency-exchange', title: 'Keep 80% of earnings', text: 'Transparent payouts, no gatekeeping, no listing fees to start.' },
  ];

  steps = [
    { n: 1, t: 'Create a free account', d: 'Just an email. No card, no commitment.' },
    { n: 2, t: 'Write or import', d: 'Use the Markdown Studio or drop in a PDF/Word file.' },
    { n: 3, t: 'Publish your first product', d: 'It appears on the Courses page the moment it is live.' },
    { n: 4, t: 'Go public as an Author', d: 'Flip the switch — your profile, followers and community open up.' },
  ];

  submit() {
    const f = this.form();
    if (f.name.trim() && f.email.includes('@')) this.submitted.set(true);
  }
}
