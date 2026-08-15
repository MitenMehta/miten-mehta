import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, Eye, Trash2, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  landing_page: string;
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

const STATUS_OPTIONS = ["new", "contacted", "qualified", "converted", "lost"] as const;
const STATUS_COLORS = {
  new: "bg-green-100 text-green-800 border-green-300",
  contacted: "bg-blue-100 text-blue-800 border-blue-300",
  qualified: "bg-yellow-100 text-yellow-800 border-yellow-300",
  converted: "bg-purple-100 text-purple-800 border-purple-300",
  lost: "bg-gray-100 text-gray-800 border-gray-300",
};

export default function LeadsCRM() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLandingPage, setSelectedLandingPage] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedUtmSource, setSelectedUtmSource] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Sorting state
  const [sortField, setSortField] = useState<keyof Lead>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Selected lead for viewing/editing
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [editingStatus, setEditingStatus] = useState("");

  // Fetch leads
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Lead[];
    },
  });

  // Get unique values for filters
  const landingPages = useMemo(() => {
    const pages = new Set(leads.map(lead => lead.landing_page));
    return Array.from(pages).sort();
  }, [leads]);

  const utmSources = useMemo(() => {
    const sources = new Set(leads.map(lead => lead.utm_source).filter(Boolean));
    return Array.from(sources).sort();
  }, [leads]);

  // Filter and sort leads
  const filteredAndSortedLeads = useMemo(() => {
    const filtered = leads.filter(lead => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.phone.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Landing page filter
      if (selectedLandingPage !== "all" && lead.landing_page !== selectedLandingPage) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "all" && lead.status !== selectedStatus) {
        return false;
      }

      // UTM source filter
      if (selectedUtmSource !== "all" && lead.utm_source !== selectedUtmSource) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [leads, searchQuery, selectedLandingPage, selectedStatus, selectedUtmSource, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedLeads.length / itemsPerPage);
  const paginatedLeads = filteredAndSortedLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update lead mutation
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Lead> }) => {
      const { error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({
        title: "Lead updated",
        description: "Lead information has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update lead.",
        variant: "destructive",
      });
    },
  });

  // Delete lead mutation
  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({
        title: "Lead deleted",
        description: "Lead has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete lead.",
        variant: "destructive",
      });
    },
  });

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    updateLeadMutation.mutate({ id: leadId, updates: { status: newStatus } });
  };

  const handleSaveNotes = () => {
    if (selectedLead) {
      updateLeadMutation.mutate({ 
        id: selectedLead.id, 
        updates: { notes: editingNotes, status: editingStatus } 
      });
      setSelectedLead(null);
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Landing Page", "Status", "UTM Source", "UTM Campaign", "Created At", "Notes"],
      ...filteredAndSortedLeads.map(lead => [
        lead.name,
        lead.email,
        lead.phone,
        lead.landing_page,
        lead.status,
        lead.utm_source || "",
        lead.utm_campaign || "",
        format(new Date(lead.created_at), "yyyy-MM-dd HH:mm"),
        lead.notes || "",
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLandingPage("all");
    setSelectedStatus("all");
    setSelectedUtmSource("all");
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads CRM</h1>
          <p className="text-muted-foreground">
            Manage and track all your leads from various landing pages
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Filtered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAndSortedLeads.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {leads.filter(l => l.status === "new").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Converted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {leads.filter(l => l.status === "converted").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Name, email, phone..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Landing Page</label>
                <Select value={selectedLandingPage} onValueChange={(value) => {
                  setSelectedLandingPage(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pages</SelectItem>
                    {landingPages.map(page => (
                      <SelectItem key={page} value={page}>{page}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={(value) => {
                  setSelectedStatus(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">UTM Source</label>
                <Select value={selectedUtmSource} onValueChange={(value) => {
                  setSelectedUtmSource(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {utmSources.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort("name")}>
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort("landing_page")}>
                      Landing Page
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>UTM Source</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort("status")}>
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => handleSort("created_at")}>
                      Created
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No leads found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLeads.map(lead => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{lead.landing_page}</Badge>
                      </TableCell>
                      <TableCell>
                        {lead.utm_source && (
                          <Badge variant="secondary">{lead.utm_source}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {lead.utm_campaign || "-"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(value) => handleStatusChange(lead.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue>
                              <Badge className={STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS]}>
                                {lead.status}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map(status => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(lead.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setEditingNotes(lead.notes || "");
                                  setEditingStatus(lead.status);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="w-[500px] sm:max-w-[500px]">
                              <SheetHeader>
                                <SheetTitle>Lead Details</SheetTitle>
                                <SheetDescription>
                                  View and edit lead information
                                </SheetDescription>
                              </SheetHeader>
                              {selectedLead && (
                                <div className="space-y-6 mt-6">
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Contact Information</h4>
                                      <div className="space-y-2 text-sm">
                                        <p><strong>Name:</strong> {selectedLead.name}</p>
                                        <p><strong>Email:</strong> {selectedLead.email}</p>
                                        <p><strong>Phone:</strong> {selectedLead.phone}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Source Information</h4>
                                      <div className="space-y-2 text-sm">
                                        <p><strong>Landing Page:</strong> {selectedLead.landing_page}</p>
                                        <p><strong>Created:</strong> {format(new Date(selectedLead.created_at), "PPpp")}</p>
                                      </div>
                                    </div>

                                    {(selectedLead.utm_source || selectedLead.utm_medium || selectedLead.utm_campaign) && (
                                      <div>
                                        <h4 className="text-sm font-semibold text-muted-foreground mb-1">UTM Parameters</h4>
                                        <div className="space-y-2 text-sm">
                                          {selectedLead.utm_source && <p><strong>Source:</strong> {selectedLead.utm_source}</p>}
                                          {selectedLead.utm_medium && <p><strong>Medium:</strong> {selectedLead.utm_medium}</p>}
                                          {selectedLead.utm_campaign && <p><strong>Campaign:</strong> {selectedLead.utm_campaign}</p>}
                                          {selectedLead.utm_content && <p><strong>Content:</strong> {selectedLead.utm_content}</p>}
                                          {selectedLead.utm_term && <p><strong>Term:</strong> {selectedLead.utm_term}</p>}
                                        </div>
                                      </div>
                                    )}

                                    <div className="space-y-2">
                                      <label className="text-sm font-semibold text-muted-foreground">Status</label>
                                      <Select value={editingStatus} onValueChange={setEditingStatus}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {STATUS_OPTIONS.map(status => (
                                            <SelectItem key={status} value={status}>
                                              {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-semibold text-muted-foreground">Notes</label>
                                      <Textarea
                                        value={editingNotes}
                                        onChange={(e) => setEditingNotes(e.target.value)}
                                        placeholder="Add notes about this lead..."
                                        rows={5}
                                      />
                                    </div>

                                    <Button onClick={handleSaveNotes} className="w-full">
                                      Save Changes
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </SheetContent>
                          </Sheet>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this lead? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteLeadMutation.mutate(lead.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredAndSortedLeads.length)} of{" "}
                {filteredAndSortedLeads.length} leads
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
