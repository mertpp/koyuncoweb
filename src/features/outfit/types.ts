import type { GarmentListItemRead } from "@/features/garment/types";

export type OutfitSource = "manual" | "generated";
export type OutfitStatus = "saved" | "archived";

export type OutfitItemCreate = {
  garment_id: string;
  position: number;
};

export type CreateOutfitPayload = {
  source?: OutfitSource;
  items: OutfitItemCreate[];
};

export type UpdateOutfitPayload = {
  status?: OutfitStatus | null;
};

export type OutfitItemRead = {
  garment: GarmentListItemRead;
  position: number;
};

export type OutfitRead = {
  id: string;
  workspace_id: string;
  collection_id: string;
  created_by_account_id: string;
  source: OutfitSource;
  status: OutfitStatus;
  items: OutfitItemRead[];
  created_at: string;
  updated_at: string;
};
