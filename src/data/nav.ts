// Navigation — original labels and destinations from the live site (content),
// styled by our design (presentation). No invented copy.
export interface NavItem {
  label: string;
  href: string;
}

export const primaryNav: NavItem[] = [
  { label: 'Ayurveda A to Z Treatments', href: '/ayurvedic-treatments/' },
  { label: 'Detox Clinic', href: '/detox-clinic/' },
  { label: 'Conditions', href: '/conditions/' },
  { label: 'Ayurveda Spa', href: '/ayurvedic-spa/' },
  { label: 'Shop', href: '/shop/' },
  { label: 'About', href: '/about-us/' },
  { label: 'Contact Us', href: '/contact-us/' },
];

export const bookHref = '/book-appointment/';
export const phone = '02 9389 2581';
export const phoneHref = 'tel:+61293892581';
export const email = 'info@ayurvedicwellnesscentre.com.au';
export const address = 'Bondi Junction, Sydney NSW';
export const instagram = 'https://www.instagram.com/ayurvedicwellnesscentre/';
