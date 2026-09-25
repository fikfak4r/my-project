/**
 * Infutia Learn — domain models
 * The home of Digital Products on the internet.
 */

export type ProductFormat = 'ebook' | 'course' | 'template' | 'guide' | 'audiobook';

export interface Chapter {
  id: string;
  title: string;
  minutes: number;
  /** Infutia Markdown source */
  body: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  authorId: string;
  format: ProductFormat;
  category: string;
  price: number; // NGN; 0 = free
  rating: number;
  readers: number;
  chapters: number;
  coverFrom: string;
  coverTo: string;
  icon: string;
  excerpt: string;
  tags: string[];
  new?: boolean;
  trending?: boolean;
}

export interface Author {
  id: string;
  name: string;
  handle: string;
  role: string;
  bio: string;
  avatarFrom: string;
  avatarTo: string;
  initials: string;
  followers: number;
  products: number;
  rating: number;
  verified: boolean;
  location: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}
