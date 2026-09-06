"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MailCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  async function onSubmit(values: Values) {
    if (submitting) return;
    setSubmitting(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
    });
    // Always show success (don't reveal whether an email exists).
    setSentEmail(values.email);
    setSubmitting(false);
  }

  if (sentEmail) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-brand-orange-light text-brand-orange-dark">
          <MailCheck className="size-6" aria-hidden="true" />
        </span>
        <p className="text-sm text-slate-600">
          If an account exists for <strong className="text-brand-navy">{sentEmail}</strong>, a password reset link
          is on its way.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="forgot-email">Email</Label>
        <Input id="forgot-email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Sending…" : "Send Reset Link"}
        {!submitting && <Send className="size-4" data-icon="inline-end" />}
      </Button>
    </form>
  );
}
