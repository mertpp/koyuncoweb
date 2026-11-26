"use client";

import type { GarmentCondition, GarmentRead, GarmentUpdate } from "@/features/garment/types";
import { taxonomyLabel, type GarmentType } from "@/features/taxonomy/api";
import type { ApiErrorInfo } from "@/shared/api/errors";
import { Field, Input, Select, Textarea } from "@/shared/components/koyun/field";

// The garment details form: used by the review step of GarmentSetup (J2) and by the edit
// page (D15). It only holds what the user typed; the backend validates it (422 per field).

const conditionOptions: ReadonlyArray<{ value: GarmentCondition; label: string }> = [
  { value: "new_with_tags", label: "New with tags" },
  { value: "new_without_tags", label: "New without tags" },
  { value: "very_good", label: "Very good" },
  { value: "fair", label: "Fair" },
];

export type GarmentForm = {
  title: string;
  typeId: string;
  brand: string;
  size: string;
  condition: string;
  notes: string;
};

export function formFrom(garment: GarmentRead | null): GarmentForm {
  return {
    title: garment?.title ?? "",
    typeId: garment?.garment_type_id ?? "",
    brand: garment?.brand_raw ?? "",
    size: garment?.size ?? "",
    condition: garment?.condition ?? "",
    notes: garment?.notes ?? "",
  };
}

function textOrNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function toCondition(value: string): GarmentCondition | null {
  return conditionOptions.find((option) => option.value === value)?.value ?? null;
}

/** The PATCH body for the form. Empty title or type are left out: the backend says which it needs. */
export function updateFrom(form: GarmentForm): GarmentUpdate {
  const title = textOrNull(form.title);

  return {
    ...(title ? { title } : {}),
    ...(form.typeId ? { garment_type_id: form.typeId } : {}),
    brand_raw: textOrNull(form.brand),
    size: textOrNull(form.size),
    condition: toCondition(form.condition),
    notes: textOrNull(form.notes),
  };
}

export function GarmentFields({
  form,
  onChange,
  error,
  types,
}: {
  form: GarmentForm;
  onChange: (field: keyof GarmentForm, value: string) => void;
  error: ApiErrorInfo | null;
  types: GarmentType[];
}) {
  const fieldError = (field: string) => error?.fieldErrors[field];
  // Inactive types are hidden, except the one the garment already has.
  const activeTypes = types.filter((type) => type.active);
  const typeList =
    form.typeId && !activeTypes.some((type) => type.code === form.typeId)
      ? [...activeTypes, ...types.filter((type) => type.code === form.typeId)]
      : activeTypes;

  return (
    <div className="grid gap-space-md md:grid-cols-2">
      <Field label="Name" htmlFor="title" error={fieldError("title")} className="md:col-span-2">
        <Input
          id="title"
          value={form.title}
          onChange={(event) => onChange("title", event.target.value)}
          aria-invalid={fieldError("title") ? true : undefined}
        />
      </Field>
      <Field label="Category" htmlFor="type" error={fieldError("garment_type_id")}>
        <Select
          id="type"
          value={form.typeId}
          onChange={(event) => onChange("typeId", event.target.value)}
          aria-invalid={fieldError("garment_type_id") ? true : undefined}
        >
          <option value="">Select a category</option>
          {typeList.map((type) => (
            <option key={type.code} value={type.code}>
              {taxonomyLabel(type.label_key)}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Brand" htmlFor="brand" error={fieldError("brand_raw")}>
        <Input id="brand" value={form.brand} onChange={(event) => onChange("brand", event.target.value)} />
      </Field>
      <Field label="Size" htmlFor="size" error={fieldError("size")}>
        <Input id="size" value={form.size} onChange={(event) => onChange("size", event.target.value)} />
      </Field>
      <Field label="Condition" htmlFor="condition" error={fieldError("condition")}>
        <Select
          id="condition"
          value={form.condition}
          onChange={(event) => onChange("condition", event.target.value)}
        >
          <option value="">Not specified</option>
          {conditionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Notes" htmlFor="notes" error={fieldError("notes")} className="md:col-span-2">
        <Textarea id="notes" value={form.notes} onChange={(event) => onChange("notes", event.target.value)} />
      </Field>
    </div>
  );
}
