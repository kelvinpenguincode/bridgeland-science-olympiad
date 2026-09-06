"use client";

import { useState, useTransition, type ReactElement } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "time"
  | "datetime-local"
  | "select"
  | "checkbox"
  | "email"
  | "url";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string | number | boolean | null;
  helpText?: string;
  fullWidth?: boolean;
  step?: string;
  min?: number;
}

const nativeSelectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function FieldRenderer({ field }: { field: FieldConfig }) {
  const [checked, setChecked] = useState(!!field.defaultValue);

  if (field.type === "checkbox") {
    return (
      <div className={cn("flex items-center gap-2 pt-6", field.fullWidth && "sm:col-span-2")}>
        <Checkbox
          id={field.name}
          checked={checked}
          onCheckedChange={(v) => setChecked(v === true)}
        />
        <input type="hidden" name={field.name} value={checked ? "true" : "false"} />
        <Label htmlFor={field.name} className="cursor-pointer font-normal">
          {field.label}
        </Label>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", field.fullWidth && "sm:col-span-2")}>
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-brand-orange">*</span>}
      </Label>
      {field.type === "textarea" ? (
        <Textarea
          id={field.name}
          name={field.name}
          required={field.required}
          placeholder={field.placeholder}
          defaultValue={(field.defaultValue as string) ?? ""}
          rows={3}
        />
      ) : field.type === "select" ? (
        <select
          id={field.name}
          name={field.name}
          required={field.required}
          defaultValue={(field.defaultValue as string) ?? ""}
          className={nativeSelectClass}
        >
          {!field.required && <option value="">—</option>}
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          id={field.name}
          name={field.name}
          type={field.type}
          step={field.step}
          min={field.min}
          required={field.required}
          placeholder={field.placeholder}
          defaultValue={(field.defaultValue as string | number) ?? ""}
        />
      )}
      {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
    </div>
  );
}

export function CrudDialog({
  trigger,
  title,
  description,
  fields,
  action,
  hiddenValues,
  submitLabel = "Save",
  onSuccessMessage = "Saved.",
}: {
  trigger: ReactElement;
  title: string;
  description?: string;
  fields: FieldConfig[];
  action: (state: ActionResult, formData: FormData) => Promise<ActionResult>;
  hiddenValues?: Record<string, string>;
  submitLabel?: string;
  onSuccessMessage?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await action({ success: false }, formData);
      if (result.success) {
        toast.success(onSuccessMessage);
        setOpen(false);
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          {hiddenValues &&
            Object.entries(hiddenValues).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)}
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <FieldRenderer key={field.name} field={field} />
            ))}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
