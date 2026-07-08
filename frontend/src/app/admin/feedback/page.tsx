"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  MessageSquare,
  CheckCircle2,
  Trash2,
  Filter,
} from "lucide-react";
import { formatDateTime, truncate } from "@/lib/utils";
import type { Feedback } from "@/types";

export default function AdminFeedbackPage() {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "resolved" | "unresolved">(
    "all"
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await api.get<Feedback[]>("/feedback");
    if (res.success && res.data) {
      setFeedback(res.data);
    } else {
      setError(res.error || "Failed to load feedback");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const toggleResolved = async (item: Feedback) => {
    setSaving(true);
    const res = await api.put(`/feedback/${item._id}`, {
      resolved: !item.resolved,
    });
    setSaving(false);
    if (res.success) {
      toast("success", `Feedback marked as ${item.resolved ? "unresolved" : "resolved"}`);
      fetchFeedback();
    } else {
      toast("error", res.error || "Update failed");
    }
  };

  const openDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    const res = await api.delete(`/feedback/${deletingId}`);
    setSaving(false);
    if (res.success) {
      toast("success", "Feedback deleted");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      fetchFeedback();
    } else {
      toast("error", res.error || "Delete failed");
    }
  };

  const filtered =
    filter === "all"
      ? feedback
      : feedback.filter((f) =>
          filter === "resolved" ? f.resolved : !f.resolved
        );

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchFeedback} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Feedback Management</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            View and manage user feedback
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          {(["all", "unresolved", "resolved"] as const).map((opt) => (
            <Button
              key={opt}
              variant={filter === opt ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(opt)}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Feedback"
        description="Are you sure you want to delete this feedback? This action cannot be undone."
        onConfirm={handleDelete}
        loading={saving}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No Feedback"
          description={
            filter === "all"
              ? "No feedback has been submitted yet."
              : `No ${filter} feedback found.`
          }
        />
      ) : (
        <div className="rounded-xl border border-[hsl(var(--border))] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))]">
                    {item.email}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {truncate(item.message, 60)}
                  </TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))] text-sm">
                    {formatDateTime(item.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.resolved ? "success" : "warning"}
                    >
                      {item.resolved ? "Resolved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleResolved(item)}
                        disabled={saving}
                      >
                        <CheckCircle2
                          className={`h-4 w-4 ${
                            item.resolved
                              ? "text-green-500"
                              : "text-[hsl(var(--muted-foreground))]"
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDelete(item._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
