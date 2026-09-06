import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | Bridgeland Science Olympiad",
};

export default function LoginPage() {
  return (
    <AuthCard
      eyebrow="Member Portal"
      title="Sign In"
      description="Access your dashboard, events, resources, and placement results."
      footer={
        <p>
          New to the team?{" "}
          <Link href="/signup" className="font-medium text-brand-orange-dark hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
