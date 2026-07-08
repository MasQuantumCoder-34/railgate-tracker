"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { History, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { GateUpdate } from "@/types";

const ITEMS_PER_PAGE = 10;

export default function AdminHistoryPage() {
  const { toast } = useToast();
  const [updates, setUpdates] = useState<GateUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchUpdates = useCallback(async () => {
    setLoading(true);
    setError(null);
    let endpoint = "/status/updates";
    if (date) endpoint += `?date=${date}`;
    const res = await api.get<GateUpdate[]>(endpoint);
    if (res.success && res.data) {
      setUpdates(res.data);
    } else {
      setError(res.error || "Failed to load updates");
    }
    setLoading(false);
  }, [date]);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const openDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    const res = await api.delete(`/status/updates/${deletingId}`);
    setSaving(false);
    if (res.success) {
      toast("success", "Update deleted");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      fetchUpdates();
    } else {
      toast("error", res.error || "Delete failed");
    }
  };

  const totalPages = Math.ceil(updates.length / ITEMS_PER_PAGE);
  const paginated = updates.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchUpdates} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Update History</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          View and manage gate status update history
        </p>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1 max-w-xs">
          <Input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setPage(1);
            }}
            label="Filter by date"
          />
        </div>
        <Button variant="outline" onClick={() => { setDate(""); setPage(1); }}>
          Clear
        </Button>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Update"
        description="Are you sure you want to delete this update? This action cannot be undone."
        onConfirm={handleDelete}
        loading={saving}
      />

      {paginated.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Updates"
          description={
            date
              ? `No updates found for ${date}`
              : "No gate status updates recorded yet."
          }
        />
      ) : (
        <>
          <div className="rounded-xl border border-[hsl(var(--border))] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead>Train</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((update) => (
                  <TableRow key={update._id}>
                    <TableCell>
                      <Badge
                        variant={
                          update.status === "OPEN"
                            ? "success"
                            : "destructive"
                        }
                      >
                        {update.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {update.waitTime
                        ? `${update.waitTime} min`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {update.trainName
                        ? `${update.trainName} (${update.trainNumber || ""})`
                        : "-"}
                    </TableCell>
                    <TableCell>{update.direction || "-"}</TableCell>
                    <TableCell className="text-sm text-[hsl(var(--muted-foreground))]">
                      {formatDateTime(update.timestamp)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDelete(update._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-[hsl(var(--muted-foreground))]">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
