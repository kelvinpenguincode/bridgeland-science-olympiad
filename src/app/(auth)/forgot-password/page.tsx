import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password | Bridgeland Science Olympiad",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Account Recovery"
      title="Forgot Your Password?"
      description="Enter your email and we'll send you a link to reset your password."
      footer={
        <p>
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-brand-orange-dark hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
