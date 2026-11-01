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

export type GarmentPhoto = {
  id: string;
  garment_id: string;
  original_key: string;
  cutout_key: string | null;
  status: string;
  kind: string;
  sort_order: number;
  created_at: string;
};

export type CreateGarmentInput = {
  title: string;
  garment_type_id: string;
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

export function uploadGarmentPhoto(
  auth: ApiAuthOptions,
  workspaceId: string,
  garmentId: string,
  file: File,
) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("sort_order", "1");

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
