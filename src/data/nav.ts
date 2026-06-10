// Editorial navigation — intentionally tighter than the old mega-menu.
export interface NavItem {
  label: string;
  href: string;
  feature?: { heading: string; blurb: string; items: { label: string; href: string }[] };
}

export const primaryNav: NavItem[] = [
  {
    label: 'Treatments',
    href: '/treatments/',
    feature: {
      heading: 'Signature Therapies',
      blurb: 'Authentic Ayurvedic bodywork, performed by trained therapists.',
      items: [
        { label: 'Shirodhara', href: '/services/shirodhara-treatment-bondi-sydney/' },
        { label: 'Abhyanga Oil Massage', href: '/services/ayurvedic-massage-in-bondi-junction/' },
        { label: 'Panchakarma Detox', href: '/services/panchakarma-ayurvedic-detox-sydney/' },
        { label: 'Pizzichil', href: '/services/pizzichil-treatment/' },
        { label: 'Udvartana (Weight Loss)', href: '/services/udvartana-massage-for-weight-loss-sydney/' },
        { label: 'Couples Massage', href: '/services/couples-massage/' },
      ],
    },
  },
  {
    label: 'Conditions',
    href: '/conditions/',
    feature: {
      heading: 'Healing, By Concern',
      blurb: 'Ayurveda treats the root cause — not just the symptom.',
      items: [
        { label: 'Stress & Anxiety', href: '/services/stress-2/' },
        { label: 'Insomnia', href: '/services/insomnia/' },
        { label: 'Digestive / IBS', href: '/services/irritable-bowel-syndrome/' },
        { label: 'Menopause', href: '/services/menopause-treatment/' },
        { label: 'Skin Problems', href: '/services/skin-problems/' },
        { label: 'Joint & Back Pain', href: '/services/joint-problems/' },
      ],
    },
  },
  { label: 'Panchakarma Detox', href: '/detox-clinic/' },
  { label: 'The Spa', href: '/ayurvedic-spa/' },
  { label: 'Shop', href: '/shop/' },
  { label: 'Journal', href: '/journal/' },
  { label: 'About', href: '/about-us/' },
];

export const bookHref = '/book-appointment/';
export const phone = '02 9389 2581';
export const phoneHref = 'tel:+61293892581';
export const email = 'info@ayurvedicwellnesscentre.com.au';
export const address = 'Bondi Junction, Sydney NSW';
