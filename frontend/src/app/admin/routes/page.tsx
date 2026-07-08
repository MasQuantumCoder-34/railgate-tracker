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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import type { Route as RouteType } from "@/types";

export default function AdminRoutesPage() {
  const { toast } = useToast();
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    routeName: "",
    distance: "",
    status: "active" as "active" | "inactive",
  });

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await api.get<RouteType[]>("/routes");
    if (res.success && res.data) {
      setRoutes(res.data);
    } else {
      setError(res.error || "Failed to load routes");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const openAdd = () => {
    setEditingRoute(null);
    setForm({ routeName: "", distance: "", status: "active" });
    setDialogOpen(true);
  };

  const openEdit = (route: RouteType) => {
    setEditingRoute(route);
    setForm({
      routeName: route.routeName,
      distance: String(route.distance),
      status: route.status,
    });
    setDialogOpen(true);
  };

  const openDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.routeName || !form.distance) {
      toast("error", "Please fill in all required fields");
      return;
    }
    setSaving(true);
    const body = {
      routeName: form.routeName,
      distance: parseFloat(form.distance),
      status: form.status,
    };
    const res = editingRoute
      ? await api.put(`/routes/${editingRoute._id}`, body)
      : await api.post("/routes", body);
    setSaving(false);

    if (res.success) {
      toast("success", editingRoute ? "Route updated" : "Route added");
      setDialogOpen(false);
      fetchRoutes();
    } else {
      toast("error", res.error || "Save failed");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    const res = await api.delete(`/routes/${deletingId}`);
    setSaving(false);

    if (res.success) {
      toast("success", "Route deleted");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      fetchRoutes();
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
    return <ErrorState message={error} onRetry={fetchRoutes} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Route Management</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Add, edit, or manage alternative routes
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Route
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRoute ? "Edit Route" : "Add Route"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label="Route Name *"
              value={form.routeName}
              onChange={(e) =>
                setForm({ ...form, routeName: e.target.value })
              }
              placeholder="e.g. Service Road Bypass"
            />
            <Input
              label="Distance (km) *"
              type="number"
              step="0.1"
              value={form.distance}
              onChange={(e) =>
                setForm({ ...form, distance: e.target.value })
              }
              placeholder="e.g. 2.5"
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as "active" | "inactive",
                })
              }
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {editingRoute ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Route"
        description="Are you sure you want to delete this route? This action cannot be undone."
        onConfirm={handleDelete}
        loading={saving}
      />

      {routes.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No Routes"
          description="No routes have been added yet. Click 'Add Route' to get started."
        />
      ) : (
        <div className="rounded-xl border border-[hsl(var(--border))] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route Name</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route._id}>
                  <TableCell className="font-medium">
                    {route.routeName}
                  </TableCell>
                  <TableCell>{route.distance} km</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        route.status === "active" ? "success" : "secondary"
                      }
                    >
                      {route.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(route)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDelete(route._id)}
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
