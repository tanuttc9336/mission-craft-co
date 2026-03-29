export interface IndustryConfig {
  slug: string;
  label: string;
  available: boolean; // false = "Coming Soon" in dropdown
}

export const industryConfigs: IndustryConfig[] = [
  { slug: 'golf', label: 'Golf', available: true },
  { slug: 'automotive', label: 'Automotive', available: false },
  { slug: 'food-beverage', label: 'F&B', available: false },
];
