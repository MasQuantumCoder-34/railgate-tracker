"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Plus, Pencil, Trash2, Train } from "lucide-react";
import type { Train as TrainType } from "@/types";

export default function AdminTrainsPage() {
  const { toast } = useToast();
  const [trains, setTrains] = useState<TrainType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<TrainType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    trainName: "",
    trainNumber: "",
    route: "",
    direction: "up",
  });

  const fetchTrains = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await api.get<TrainType[]>("/trains");
    if (res.success && res.data) {
      setTrains(res.data);
    } else {
      setError(res.error || "Failed to load trains");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTrains();
  }, [fetchTrains]);

  const openAdd = () => {
    setEditingTrain(null);
    setForm({ trainName: "", trainNumber: "", route: "", direction: "up" });
    setDialogOpen(true);
  };

  const openEdit = (train: TrainType) => {
    setEditingTrain(train);
    setForm({
      trainName: train.trainName,
      trainNumber: train.trainNumber,
      route: train.route,
      direction: train.direction,
    });
    setDialogOpen(true);
  };

  const openDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.trainName || !form.trainNumber || !form.route) {
      toast("error", "Please fill in all required fields");
      return;
    }
    setSaving(true);
    const res = editingTrain
      ? await api.put(`/trains/${editingTrain._id}`, form)
      : await api.post("/trains", form);
    setSaving(false);

    if (res.success) {
      toast("success", editingTrain ? "Train updated" : "Train added");
      setDialogOpen(false);
      fetchTrains();
    } else {
      toast("error", res.error || "Save failed");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    const res = await api.delete(`/trains/${deletingId}`);
    setSaving(false);

    if (res.success) {
      toast("success", "Train deleted");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      fetchTrains();
    } else {
      toast("error", res.error || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchTrains} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Train Management</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Add, edit, or remove trains
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Train
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTrain ? "Edit Train" : "Add Train"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label="Train Name *"
              value={form.trainName}
              onChange={(e) =>
                setForm({ ...form, trainName: e.target.value })
              }
              placeholder="e.g. Chennai Express"
            />
            <Input
              label="Train Number *"
              value={form.trainNumber}
              onChange={(e) =>
                setForm({ ...form, trainNumber: e.target.value })
              }
              placeholder="e.g. 12345"
            />
            <Input
              label="Route *"
              value={form.route}
              onChange={(e) => setForm({ ...form, route: e.target.value })}
              placeholder="e.g. Chennai-Bangalore"
            />
            <Select
              label="Direction"
              value={form.direction}
              onChange={(e) =>
                setForm({ ...form, direction: e.target.value })
              }
              options={[
                { value: "up", label: "Up" },
                { value: "down", label: "Down" },
              ]}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {editingTrain ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Train"
        description="Are you sure you want to delete this train? This action cannot be undone."
        onConfirm={handleDelete}
        loading={saving}
      />

      {trains.length === 0 ? (
        <EmptyState
          icon={Train}
          title="No Trains"
          description="No trains have been added yet. Click 'Add Train' to get started."
        />
      ) : (
        <div className="rounded-xl border border-[hsl(var(--border))] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Train Name</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trains.map((train) => (
                <TableRow key={train._id}>
                  <TableCell className="font-medium">
                    {train.trainName}
                  </TableCell>
                  <TableCell>{train.trainNumber}</TableCell>
                  <TableCell>{train.route}</TableCell>
                  <TableCell>
                    <span
                      className={
                        train.direction.toLowerCase() === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {train.direction}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(train)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDelete(train._id)}
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
