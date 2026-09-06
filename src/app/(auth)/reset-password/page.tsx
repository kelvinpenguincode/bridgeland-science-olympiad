import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Set New Password | Bridgeland Science Olympiad",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard eyebrow="Account Recovery" title="Set a New Password">
      <ResetPasswordForm />
    </AuthCard>
  );
}
