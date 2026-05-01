export interface IndustryConfig {
  slug: string;
  label: string;
  available: boolean; // false = "Coming Soon" in dropdown
}

// Industries + cross-industry capabilities. Drone is a capability that
// crosses every industry (real estate, hospitality, automotive, sport),
// so it lives here rather than in a separate Services menu.
export const industryConfigs: IndustryConfig[] = [
  { slug: 'golf', label: 'Golf', available: true },
  { slug: 'drone', label: 'Drone', available: true },
  { slug: 'automotive', label: 'Automotive', available: false },
  { slug: 'food-beverage', label: 'F&B', available: false },
];
