"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Mail, Phone, MapPin, Send, Train } from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email address";
    if (!form.message.trim()) errs.message = "Message is required";
    else if (form.message.trim().length < 10)
      errs.message = "Message must be at least 10 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const res = await api.post("/feedback", form);
    setSubmitting(false);

    if (res.success) {
      toast("success", "Feedback submitted successfully!");
      setForm({ name: "", email: "", message: "" });
    } else {
      toast("error", res.error || "Failed to submit feedback");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="rounded-full bg-brand-50 dark:bg-brand-900/30 p-3 inline-flex mb-4">
          <Train className="h-8 w-8 text-brand-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">About GateWatch</h1>
        <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
          GateWatch Vaniyambadi is a real-time railway gate monitoring system
          designed to keep the community informed about gate status, train
          schedules, and alternative routes. Our mission is to improve road
          safety and reduce wait times at railway crossings.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Send Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                error={errors.name}
                placeholder="Your name"
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                error={errors.email}
                placeholder="your@email.com"
              />
              <Textarea
                label="Message"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                error={errors.message}
                placeholder="Your feedback or question..."
                rows={4}
              />
              <Button type="submit" loading={submitting} className="w-full">
                <Send className="h-4 w-4" />
                Send Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-brand-500 mt-0.5" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Vaniyambadi, Tamil Nadu
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-brand-500 mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  gatewatch@vaniyambadi.in
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-brand-500 mt-0.5" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  +91 12345 67890
                </p>
              </div>
            </div>
            <div className="border-t border-[hsl(var(--border))] pt-4 mt-6">
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                For urgent gate-related issues, please contact the local railway
                authorities directly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
