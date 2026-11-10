import { API_BASE_URL } from "@/shared/config/api";

// 1. Nuevo tipo de autenticación recomendado
export type ApiAuthOptions = {
  accessToken?: string | null;
  ownerId?: string | null;
};

export type TaxonomyItem = {
  code: string;
  label_key: string;
  parent_code?: string | null;
  description?: string | null;
  sort_order: number;
  active: boolean;
};

export type ColorItem = {
  code: string;
  label_key: string;
  hex_hint?: string | null;
  sort_order: number;
  active: boolean;
};

export type Workspace = {
  id: string;
  owner_account_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type CatalogBrand = {
  id: string;
  canonical_name: string;
  aliases?: string[];
};

export type GarmentCondition =
  | "new_with_tags"
  | "new_without_tags"
  | "very_good"
  | "fair";

export type Garment = {
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
  colors: Array<{
    code: string;
    source: string;
    confidence: number | null;
  }>;
  materials: Array<{
    code: string;
    source: string;
    confidence: number | null;
  }>;
  size: string | null;
  condition: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GarmentPhotoStatus = "pending" | "processing" | "ready" | "failed";

export type GarmentPhotoKind =
  | "front"
  | "back"
  | "side"
  | "detail"
  | "label"
  | "fit"
  | "collar"
  | "sleeve"
  | "fabric"
  | "defect"
  | "tag"
  | "inside"
  | "on_body"
  | "unknown";

export type GarmentPhoto = {
  id: string;
  garment_id: string;
  original_key: string;
  cutout_key: string | null;
  thumb_key: string | null;
  original_url: string | null;
  cutout_url: string | null;
  thumb_url: string | null;
  display_url: string | null;
  status: GarmentPhotoStatus;
  kind: GarmentPhotoKind;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
};

export type UploadGarmentPhotoOptions = {
  kind?: GarmentPhotoKind;
  sort_order?: number;
};

export type UpdateGarmentPhotoInput = Partial<{
  kind: GarmentPhotoKind;
  sort_order: number;
  is_primary: boolean;
}>;

export type CreateGarmentInput = {
  title: string;
  garment_type_id: string;
  brand_id?: string | null;
  brand_raw?: string | null;
  size?: string | null;
  condition?: GarmentCondition | null;
  notes?: string | null;
};

async function requestJson<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function requestVoid(
  path: string,
  options: RequestInit = {},
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed with status ${response.status}`);
  }
}

// 2. Reemplazamos withOwnerHeaders por authHeaders con el nuevo patrón
function authHeaders(options: ApiAuthOptions = {}): HeadersInit {
  if (options.accessToken) {
    return {
      authorization: `Bearer ${options.accessToken}`,
    };
  }

  if (options.ownerId) {
    return {
      "x-owner-id": options.ownerId,
    };
  }

  return {};
}

// 3. Actualizamos todas las funciones para que acepten 'auth: ApiAuthOptions' en lugar de 'ownerId: string'

export function ensureAccount(auth: ApiAuthOptions) {
  return requestJson("/v1/me", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...authHeaders(auth),
    },
    body: JSON.stringify({
      locale: "es",
    }),
  });
}

export function listGarmentTypes() {
  return requestJson<TaxonomyItem[]>("/v1/taxonomy/garment-types");
}

export function listColors() {
  return requestJson<ColorItem[]>("/v1/taxonomy/colors");
}

export function listMaterials() {
  return requestJson<TaxonomyItem[]>("/v1/taxonomy/materials");
}

export function searchCatalogBrands(
  auth: ApiAuthOptions,
  query: string,
  limit = 10,
) {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
  });

  return requestJson<CatalogBrand[]>(`/v1/catalog/brands?${params.toString()}`, {
    headers: authHeaders(auth),
  });
}

export function createBrandCandidate(auth: ApiAuthOptions, rawName: string) {
  return requestJson<{ id?: string }>("/v1/catalog/brand-candidates", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...authHeaders(auth),
    },
    body: JSON.stringify({ raw_name: rawName }),
  });
}

export function listWorkspaces(auth: ApiAuthOptions) {
  return requestJson<Workspace[]>("/v1/workspaces", {
    headers: authHeaders(auth),
  });
}

export function createWorkspace(auth: ApiAuthOptions, name: string) {
  return requestJson<Workspace>("/v1/workspaces", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...authHeaders(auth),
    },
    body: JSON.stringify({ name }),
  });
}

export function createGarment(
  auth: ApiAuthOptions,
  workspaceId: string,
  input: CreateGarmentInput,
) {
  return requestJson<Garment>(`/v1/workspaces/${workspaceId}/garments`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...authHeaders(auth),
    },
    body: JSON.stringify(input),
  });
}

export function listGarments(auth: ApiAuthOptions, workspaceId: string) {
  return requestJson<Garment[]>(`/v1/workspaces/${workspaceId}/garments`, {
    headers: authHeaders(auth),
  });
}

export function uploadGarmentPhoto(
  auth: ApiAuthOptions,
  workspaceId: string,
  garmentId: string,
  file: File,
  options: UploadGarmentPhotoOptions = {},
) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("sort_order", String(options.sort_order ?? 1));
  formData.append("kind", options.kind ?? "unknown");

  return requestJson<GarmentPhoto>(
    `/v1/workspaces/${workspaceId}/garments/${garmentId}/photos/upload`,
    {
      method: "POST",
      headers: authHeaders(auth),
      body: formData,
    },
  );
}

export function getGarment(
  auth: ApiAuthOptions,
  workspaceId: string,
  garmentId: string,
) {
  return requestJson<Garment>(
    `/v1/workspaces/${workspaceId}/garments/${garmentId}`,
    {
      headers: authHeaders(auth),
    },
  );
}

export function deleteGarment(
  auth: ApiAuthOptions,
  workspaceId: string,
  garmentId: string,
) {
  return requestVoid(`/v1/workspaces/${workspaceId}/garments/${garmentId}`, {
    method: "DELETE",
    headers: authHeaders(auth),
  });
}

export function listGarmentPhotos(
  auth: ApiAuthOptions,
  workspaceId: string,
  garmentId: string,
) {
  return requestJson<GarmentPhoto[]>(
    `/v1/workspaces/${workspaceId}/garments/${garmentId}/photos`,
    {
      headers: authHeaders(auth),
    },
  );
}


export function updateGarmentPhoto(
  auth: ApiAuthOptions,
  workspaceId: string,
  garmentId: string,
  photoId: string,
  patch: UpdateGarmentPhotoInput,
) {
  return requestJson<GarmentPhoto>(
    `/v1/workspaces/${workspaceId}/garments/${garmentId}/photos/${photoId}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        ...authHeaders(auth),
      },
      body: JSON.stringify(patch),
    },
  );
}
