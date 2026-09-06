"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { password: "", confirmPassword: "" } });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setHasSession(!!data.user));
  }, []);

  async function onSubmit(values: Values) {
    if (submitting) return;
    setSubmitting(true);
    setFormError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: values.password });
    if (error) {
      setFormError(error.message);
      setSubmitting(false);
      return;
    }
    setSuccess(true);
    setSubmitting(false);
    setTimeout(() => {
      router.push("/login");
    }, 1800);
  }

  if (hasSession === false) {
    return (
      <div className="space-y-3 text-center text-sm text-slate-600">
        <p>This password reset link is invalid or has expired.</p>
        <Link href="/forgot-password" className="font-medium text-brand-orange-dark hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <p className="text-center text-sm text-slate-600">
        Password updated! Redirecting you to sign in…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="reset-password">New Password</Label>
        <Input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          aria-invalid={!!errors.password}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="reset-confirm">Confirm New Password</Label>
        <Input
          id="reset-confirm"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          aria-invalid={!!errors.confirmPassword}
        />
        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>
      {formError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      )}
      <Button type="submit" disabled={submitting || hasSession === null} className="w-full">
        {submitting ? "Updating…" : "Update Password"}
        {!submitting && <KeyRound className="size-4" data-icon="inline-end" />}
      </Button>
    </form>
  );
}
