import type { Schemas } from "@/shared/api/schemas";

// Garment types come from the generated contract (task api:generate). Never redefine them here.

export type GarmentRead = Schemas["GarmentRead"];
export type GarmentListItemRead = Schemas["GarmentListItemRead"];
export type GarmentDraftItemRead = Schemas["GarmentDraftItemRead"];
export type GarmentAttributeRead = Schemas["GarmentAttributeRead"];
export type GarmentCreate = Schemas["GarmentCreate"];
export type GarmentUpdate = Schemas["GarmentUpdate"];
export type GarmentStatus = Schemas["GarmentStatus"];
export type GarmentSource = Schemas["GarmentSource"];
export type GarmentCondition = Schemas["GarmentCondition"];

export type GarmentPhotoRead = Schemas["GarmentPhotoRead"];
export type GarmentPhotoKind = Schemas["GarmentPhotoKind"];

export type GarmentAnalysisRead = Schemas["GarmentAnalysisRead"];
export type GarmentAnalysisStatus = Schemas["GarmentAnalysisStatus"];

/** Kept for existing callers; same shape as the contract's GarmentCreate. */
export type CreateGarmentPayload = GarmentCreate;
