"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CONTACT_EMAIL = "bridgelandscioly@bridgelandbears.org";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  topic: z.enum(["general", "membership", "sponsorship", "media"]),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const TOPIC_LABELS: Record<ContactFormValues["topic"], string> = {
  general: "General Question",
  membership: "Joining the Team",
  sponsorship: "Sponsorship / Donations",
  media: "Media / Press",
};

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", topic: "general", message: "" },
  });

  const topic = watch("topic");

  function onSubmit(values: ContactFormValues) {
    setSubmitting(true);
    const subject = `[Bridgeland SciOly] ${TOPIC_LABELS[values.topic]} — ${values.name}`;
    const body = `${values.message}\n\n—\n${values.name}\n${values.email}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    toast.success("Opening your email client…", {
      description: "If nothing happens, email us directly at " + CONTACT_EMAIL,
    });
    reset();
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name">Full Name</Label>
          <Input id="contact-name" {...register("name")} aria-invalid={!!errors.name} placeholder="Jane Bear" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            {...register("email")}
            aria-invalid={!!errors.email}
            placeholder="jane@example.com"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-topic">Topic</Label>
        <Select value={topic} onValueChange={(v) => v && setValue("topic", v as ContactFormValues["topic"])}>
          <SelectTrigger id="contact-topic" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TOPIC_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          rows={5}
          {...register("message")}
          aria-invalid={!!errors.message}
          placeholder="How can we help?"
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        Send Message
        <Send className="size-3.5" data-icon="inline-end" />
      </Button>
      <p className="text-xs text-muted-foreground">
        Submitting opens your email client with this message pre-filled and addressed to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </form>
  );
}
