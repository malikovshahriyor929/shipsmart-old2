export type LandingNavigationItem = {
  label: string;
  href: string;
  children: string[];
};

export const landingNavigation: LandingNavigationItem[] = [
  { label: 'Home', href: '/', children: [] },
  {
    label: 'Shippers',
    href: '/#solutions',
    children: [
      'Managed Transportation',
      'Freight Brokerage',
      'Warehousing',
      'Dedicated Capacity',
      'Capacity Solutions',
      'Project Logistics',
      'White Glove',
      'International Logistics',
      'Expedited Freight',
    ],
  },
  {
    label: 'Carriers',
    href: '/#network',
    children: [
      'Join Our Network',
      "53' Reefer Opportunities",
      'Dry Van Opportunities',
      'Flatbed & Open-Deck',
      'Power-Only',
      'Dedicated Lanes',
      'Fuel & Safety Programs',
    ],
  },
  {
    label: 'Solutions',
    href: '/#advantages',
    children: [
      'Technology & Visibility',
      'Sustainability',
      'Safety & Compliance',
      'Cross-Border Logistics',
      'Specialized Freight',
      'E-commerce Fulfillment',
    ],
  },
  {
    label: 'Company',
    href: '/#about',
    children: [
      'About Us',
      'Leadership',
      'Careers',
      'News & Insights',
      'Contact Us',
      'Logistics Blog',
      'Industry Insights',
      'Freight Guides',
      'FAQ',
    ],
  },
];
