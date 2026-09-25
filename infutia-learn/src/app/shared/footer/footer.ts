import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly year = new Date().getFullYear();

  readonly groups = [
    {
      title: 'For Readers',
      links: [
        { label: 'Browse Courses', path: '/courses' },
        { label: 'The Reader', path: '/read/demo' },
        { label: 'Free products', path: '/courses' },
      ],
    },
    {
      title: 'For Authors',
      links: [
        { label: 'Become an Author', path: '/become-author' },
        { label: 'Infutia Markdown', path: '/how-it-works' },
        { label: 'Author profiles', path: '/authors/a1' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About the home', path: '/' },
        { label: 'How it works', path: '/how-it-works' },
        { label: 'Community', path: '/become-author' },
      ],
    },
  ];
}
