import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";

interface TrackingCode {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
  apply_to_all_pages: boolean;
  specific_pages: string[] | null;
  created_at: string;
  updated_at: string;
}

export default function TrackingCodes() {
  const [trackingCodes, setTrackingCodes] = useState<TrackingCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<TrackingCode | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [applyToAllPages, setApplyToAllPages] = useState(true);
  const [specificPages, setSpecificPages] = useState("");

  useEffect(() => {
    fetchTrackingCodes();
  }, []);

  const fetchTrackingCodes = async () => {
    try {
      const { data, error } = await supabase
        .from("tracking_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTrackingCodes(data || []);
    } catch (error) {
      console.error("Error fetching tracking codes:", error);
      toast.error("Failed to load tracking codes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !code.trim()) {
      toast.error("Name and code are required");
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        code: code.trim(),
        enabled,
        apply_to_all_pages: applyToAllPages,
        specific_pages: applyToAllPages ? null : specificPages.split("\n").map(p => p.trim()).filter(Boolean),
      };

      if (editingCode) {
        const { error } = await supabase
          .from("tracking_codes")
          .update(payload)
          .eq("id", editingCode.id);

        if (error) throw error;
        toast.success("Tracking code updated successfully");
      } else {
        const { error } = await supabase
          .from("tracking_codes")
          .insert([payload]);

        if (error) throw error;
        toast.success("Tracking code added successfully");
      }

      resetForm();
      setIsDialogOpen(false);
      fetchTrackingCodes();
    } catch (error) {
      console.error("Error saving tracking code:", error);
      toast.error("Failed to save tracking code");
    }
  };

  const handleEdit = (trackingCode: TrackingCode) => {
    setEditingCode(trackingCode);
    setName(trackingCode.name);
    setCode(trackingCode.code);
    setEnabled(trackingCode.enabled);
    setApplyToAllPages(trackingCode.apply_to_all_pages);
    setSpecificPages(trackingCode.specific_pages?.join("\n") || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tracking code?")) return;

    try {
      const { error } = await supabase
        .from("tracking_codes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Tracking code deleted successfully");
      fetchTrackingCodes();
    } catch (error) {
      console.error("Error deleting tracking code:", error);
      toast.error("Failed to delete tracking code");
    }
  };

  const resetForm = () => {
    setName("");
    setCode("");
    setEnabled(false);
    setApplyToAllPages(true);
    setSpecificPages("");
    setEditingCode(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tracking Codes</h1>
          <p className="text-muted-foreground mt-1">Manage LinkedIn Insight Tag and other tracking scripts</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Tracking Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCode ? "Edit" : "Add"} Tracking Code</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., LinkedIn Insight Tag"
                  required
                />
              </div>

              <div>
                <Label htmlFor="code">Tracking Code</Label>
                <Textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your tracking code here (e.g., <script>...</script>)"
                  rows={10}
                  required
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Paste the complete script tag from LinkedIn or other tracking service
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={enabled}
                  onCheckedChange={setEnabled}
                />
                <Label htmlFor="enabled">Enable tracking code</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="applyToAllPages"
                  checked={applyToAllPages}
                  onCheckedChange={setApplyToAllPages}
                />
                <Label htmlFor="applyToAllPages">Apply to all pages</Label>
              </div>

              {!applyToAllPages && (
                <div>
                  <Label htmlFor="specificPages">Specific Pages (one per line)</Label>
                  <Textarea
                    id="specificPages"
                    value={specificPages}
                    onChange={(e) => setSpecificPages(e.target.value)}
                    placeholder={"/\n/articles\n/articles/:slug"}
                    rows={5}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter route paths, one per line. Use :param for dynamic routes.
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCode ? "Update" : "Add"} Tracking Code
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {trackingCodes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No tracking codes added yet</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Tracking Code
              </Button>
            </CardContent>
          </Card>
        ) : (
          trackingCodes.map((trackingCode) => (
            <Card key={trackingCode.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {trackingCode.name}
                      <span className={`text-xs px-2 py-1 rounded ${trackingCode.enabled ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                        {trackingCode.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {trackingCode.apply_to_all_pages ? (
                        "Applied to all pages"
                      ) : (
                        `Applied to: ${trackingCode.specific_pages?.join(", ") || "No pages"}`
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(trackingCode)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(trackingCode.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                  <code>{trackingCode.code}</code>
                </pre>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
