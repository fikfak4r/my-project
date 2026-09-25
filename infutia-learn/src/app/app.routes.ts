import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'courses', title: 'Courses & Digital Products', loadComponent: () => import('./pages/courses/courses').then((m) => m.Courses) },
  { path: 'product/:slug', title: 'Product', loadComponent: () => import('./pages/product-detail/product-detail').then((m) => m.ProductDetail) },
  { path: 'read/:slug', title: 'Reader', loadComponent: () => import('./pages/reader/reader').then((m) => m.Reader) },
  { path: 'authors/:id', title: 'Author', loadComponent: () => import('./pages/author-profile/author-profile').then((m) => m.AuthorProfile) },
  { path: 'become-author', title: 'Become an Author', loadComponent: () => import('./pages/become-author/become-author').then((m) => m.BecomeAuthor) },
  { path: 'how-it-works', title: 'How it works', loadComponent: () => import('./pages/how-it-works/how-it-works').then((m) => m.HowItWorks) },
  { path: '**', redirectTo: '' },
];
