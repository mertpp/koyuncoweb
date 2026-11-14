export type GarmentAttributeRead = {
  code: string;
  source: string;
  confidence: number | null;
};

export type GarmentListItemRead = {
  id: string;
  title: string;
  garment_type_id: string;
  brand_id: string | null;
};

export type GarmentRead = {
  id: string;
  workspace_id: string;
  created_by_account_id: string;
  title: string;
  description: string | null;
  source: string;
  brand_id: string | null;
  brand_raw: string | null;
  product_id: string | null;
  garment_type_id: string;
  colors: GarmentAttributeRead[];
  materials: GarmentAttributeRead[];
  size: string | null;
  condition: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GarmentSource =
  | "manual"
  | "analysis"
  | "marketplace"
  | "affiliate"
  | "import";

export type GarmentCondition =
  | "new_with_tags"
  | "new_without_tags"
  | "very_good"
  | "fair";

export type CreateGarmentPayload = {
  title: string;
  description?: string | null;
  source?: GarmentSource;
  brand_id?: string | null;
  brand_raw?: string | null;
  product_id?: string | null;
  garment_type_id: string;
  size?: string | null;
  condition?: GarmentCondition | null;
  notes?: string | null;
};
