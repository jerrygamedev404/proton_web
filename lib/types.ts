export type Dimension = { L: number; W: number; H: number; wheelbase: number };
export type Variant = {
  code?: string;
  name: string;
  price?: number;
  msrp_price_rm?: number;
  promo_price_rm?: number | null;
  promo_until?: string | null;
  promo_note?: string | null;
  region_prices?: {
    peninsular_myr?: number;
    east_malaysia_myr?: number;
    labuan_myr?: number;
    langkawi_myr?: number;
  };
  engine?: string;
  transmission?: string;
  output_ps?: number;
  torque_nm?: number;
  adas?: string[];
  infotainment?: string[];
  key_features?: string[];
  colors?: string[];
};

export type Specs = {
  power?: string;
  torque?: string;
  fuelEconomy?: string;
  dimensions?: Dimension;
  seats?: number;
  tires?: string;
};

export type Model = {
  id: string;
  name: string;
  segment: "SUV" | "Sedan" | "Hatchback" | "MPV" | "EV" | string;
  priceFrom: number;
  isNew?: boolean;
  year?: number;
  highlights: string[];
  heroImage: string;
  gallery: string[];
  variants: Variant[];
  specs?: Specs;
  brochureUrl?: string;
  colors?: string[];
  tags?: ("featured" | "popular" | "ev" | string)[];
  feature_matrix?: Array<Record<string, any>>;
  sources?: { label: string; url: string }[];
  updated_at?: string;
  price_note_url?: string;
};
