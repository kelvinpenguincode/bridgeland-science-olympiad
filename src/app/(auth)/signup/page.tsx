import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create Account | Bridgeland Science Olympiad",
};

export default function SignupPage() {
  return (
    <AuthCard
      eyebrow="Join the Team"
      title="Create Your Account"
      description="Sign up to view your assigned events, meetings, resources, and placement results."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-orange-dark hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
