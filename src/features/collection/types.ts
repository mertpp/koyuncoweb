import type { GarmentListItemRead, GarmentRead } from "@/features/garment/types";

export type CollectionRead = {
  id: string;
  workspace_id: string;
  created_by_account_id: string;
  name: string;
  description: string | null;
  vision: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CreateCollectionPayload = {
  name: string;
  description?: string | null;
  vision?: string | null;
};

export type CollectionGarmentStatus = "included" | "candidate" | "rejected";

export type CollectionGarmentListStatus = CollectionGarmentStatus | "all";

export type CollectionGarmentRole =
  | "core"
  | "supporting"
  | "experimental"
  | "tension"
  | "unknown";

export type CollectionGarmentSource =
  | "manual"
  | "ai_suggested"
  | "user_confirmed"
  | "import";

export type CollectionGarmentListRelationshipRead = {
  status: CollectionGarmentStatus;
  role: CollectionGarmentRole;
  source: CollectionGarmentSource;
  user_note: string | null;
};

export type CollectionGarmentRead = {
  collection_id: string;
  garment_id: string;
  status: string;
  role: string;
  source: string;
  user_note: string | null;
  added_by_account_id: string;
  created_at: string;
  updated_at: string;
};

export type CollectionGarmentItemRead = {
  garment: GarmentListItemRead;
  collection_garment: CollectionGarmentListRelationshipRead;
};

export type CollectionGarmentDetailRead = {
  garment: GarmentRead;
  collection_garment: CollectionGarmentRead;
};

export type UpsertCollectionGarmentPayload = {
  status?: CollectionGarmentStatus;
  role?: CollectionGarmentRole;
  source?: CollectionGarmentSource;
  user_note?: string | null;
};
