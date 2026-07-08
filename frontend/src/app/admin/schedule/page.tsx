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
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, CalendarClock } from "lucide-react";

interface ScheduleEntry {
  _id: string;
  trainName: string;
  trainNumber: string;
  direction: string;
  scheduledTime: string;
  daysOfWeek: number[];
  estimatedWait: number;
  active: boolean;
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const allDays = [1, 2, 3, 4, 5, 6, 7];

export default function SchedulePage() {
  const { toast } = useToast();
  const [data, setData] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ScheduleEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    trainName: "",
    trainNumber: "",
    direction: "up",
    scheduledTime: "",
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7] as number[],
    estimatedWait: "15",
  });

  const fetchData = useCallback(async () => {
    const res = await api.get<ScheduleEntry[]>("/schedule");
    if (res.success && res.data) setData(res.data);
    else setError(res.error || "Failed to load");
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditing(null);
    setForm({ trainName: "", trainNumber: "", direction: "up", scheduledTime: "", daysOfWeek: [...allDays], estimatedWait: "15" });
    setDialogOpen(true);
  };

  const openEdit = (entry: ScheduleEntry) => {
    setEditing(entry);
    setForm({
      trainName: entry.trainName,
      trainNumber: entry.trainNumber,
      direction: entry.direction,
      scheduledTime: entry.scheduledTime,
      daysOfWeek: [...entry.daysOfWeek],
      estimatedWait: String(entry.estimatedWait),
    });
    setDialogOpen(true);
  };

  const toggleDay = (day: number) => {
    setForm((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day].sort(),
    }));
  };

  const handleSave = async () => {
    if (!form.trainName || !form.trainNumber || !form.scheduledTime || form.daysOfWeek.length === 0) {
      toast("error", "Fill all required fields");
      return;
    }
    setSaving(true);
    const payload = { ...form, estimatedWait: parseInt(form.estimatedWait) || 15 };
    const res = editing
      ? await api.put(`/schedule/${editing._id}`, payload)
      : await api.post("/schedule", payload);
    setSaving(false);
    if (res.success) {
      toast("success", editing ? "Schedule updated" : "Schedule created");
      setDialogOpen(false);
      fetchData();
    } else {
      toast("error", res.error || "Failed to save");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await api.delete(`/schedule/${deleteId}`);
    if (res.success) {
      toast("success", "Schedule deleted");
      setDeleteId(null);
      fetchData();
    } else {
      toast("error", res.error || "Failed to delete");
    }
  };

  if (loading) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarClock className="h-6 w-6" /> Train Schedule
          </h1>
          <p className="text-[hsl(var(--muted-foreground))]">Manage scheduled train timings for predictions</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Schedule</Button>
      </div>

      {data.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No Schedules" description="Add train schedules to show upcoming predictions on the home page." action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Schedule</Button>} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[hsl(var(--border))]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Train</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Dir</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Wait</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell className="font-medium">{entry.trainName}</TableCell>
                  <TableCell>{entry.trainNumber}</TableCell>
                  <TableCell>{entry.scheduledTime}</TableCell>
                  <TableCell className="uppercase">{entry.direction}</TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {allDays.map((d) => (
                        <span key={d} className={`text-[10px] w-4 h-4 flex items-center justify-center rounded ${
                          entry.daysOfWeek.includes(d)
                            ? "bg-brand-500 text-white"
                            : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                        }`}>
                          {dayLabels[d - 1]?.[0]}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{entry.estimatedWait} min</TableCell>
                  <TableCell>
                    <Badge variant={entry.active ? "success" : "secondary"}>{entry.active ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(entry)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(entry._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Schedule" : "Add Schedule"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input label="Train Name" value={form.trainName} onChange={(e) => setForm({ ...form, trainName: e.target.value })} placeholder="e.g. Chennai Express" />
            <Input label="Train Number" value={form.trainNumber} onChange={(e) => setForm({ ...form, trainNumber: e.target.value })} placeholder="e.g. 12345" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Scheduled Time" type="time" value={form.scheduledTime} onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })} />
              <Select label="Direction" value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })} options={[{ value: "up", label: "Up" }, { value: "down", label: "Down" }]} />
            </div>
            <Input label="Est. Wait (min)" type="number" min="1" value={form.estimatedWait} onChange={(e) => setForm({ ...form, estimatedWait: e.target.value })} />
            <div>
              <p className="text-sm font-medium mb-2">Days of Week</p>
              <div className="flex gap-1">
                {allDays.map((d) => (
                  <button key={d} type="button" onClick={() => toggleDay(d)} className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    form.daysOfWeek.includes(d)
                      ? "bg-brand-500 text-white border-brand-500"
                      : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))]"
                  }`}>
                    {dayLabels[d - 1]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onConfirm={handleDelete}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
        title="Delete Schedule"
        description="Are you sure you want to delete this schedule?"
      />
    </div>
  );
}
