import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, CheckCircle, XCircle, DollarSign, Search, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReturnRequest {
  id: string;
  order_id: string;
  user_id: string;
  reason: string;
  refund_amount: number;
  status: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  order_number?: string;
  customer_email?: string;
  customer_name?: string;
}

interface ReturnItem {
  id: string;
  order_item_id: string;
  quantity: number;
  reason: string | null;
  product_name?: string;
  product_price?: number;
}

const ReturnsTab = () => {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [filteredReturns, setFilteredReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Detail dialog
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  // Action states
  const [adminNotes, setAdminNotes] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchReturns();
  }, []);

  useEffect(() => {
    filterReturns();
  }, [returns, searchQuery, statusFilter]);

  const fetchReturns = async () => {
    try {
      // Fetch returns
      const { data: returnsData, error: returnsError } = await supabase
        .from("returns")
        .select("*")
        .order("created_at", { ascending: false });

      if (returnsError) throw returnsError;

      if (returnsData && returnsData.length > 0) {
        // Get unique order IDs
        const orderIds = [...new Set(returnsData.map((r) => r.order_id))];

        // Fetch order details
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("id, order_number, user_id")
          .in("id", orderIds);

        if (ordersError) throw ordersError;

        // Get unique user IDs
        const userIds = [...new Set(returnsData.map((r) => r.user_id))];

        // Fetch user profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, email, full_name")
          .in("id", userIds);

        if (profilesError) throw profilesError;

        // Create maps for quick lookup
        const ordersMap = new Map(ordersData?.map((o) => [o.id, o]) || []);
        const profilesMap = new Map(profilesData?.map((p) => [p.id, p]) || []);

        // Combine data
        const enrichedReturns = returnsData.map((ret) => ({
          ...ret,
          order_number: ordersMap.get(ret.order_id)?.order_number || "N/A",
          customer_email: profilesMap.get(ret.user_id)?.email || "N/A",
          customer_name: profilesMap.get(ret.user_id)?.full_name || "N/A",
        }));

        setReturns(enrichedReturns);
      } else {
        setReturns([]);
      }
    } catch (error) {
      console.error("Error fetching returns:", error);
      toast({
        title: "Error",
        description: "Failed to fetch return requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterReturns = () => {
    let filtered = [...returns];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ret) =>
          ret.order_number?.toLowerCase().includes(query) ||
          ret.customer_email?.toLowerCase().includes(query) ||
          ret.customer_name?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((ret) => ret.status === statusFilter);
    }

    setFilteredReturns(filtered);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      case "received":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const openDetailDialog = async (returnRequest: ReturnRequest) => {
    setSelectedReturn(returnRequest);
    setAdminNotes(returnRequest.admin_notes || "");
    setRefundAmount(returnRequest.refund_amount.toString());
    setIsDetailDialogOpen(true);
    setItemsLoading(true);

    try {
      // Fetch return items with product details
      const { data: itemsData, error: itemsError } = await supabase
        .from("return_items")
        .select("*")
        .eq("return_id", returnRequest.id);

      if (itemsError) throw itemsError;

      if (itemsData && itemsData.length > 0) {
        // Get order item IDs
        const orderItemIds = itemsData.map((item) => item.order_item_id);

        // Fetch order items for product names and prices
        const { data: orderItemsData, error: orderItemsError } = await supabase
          .from("order_items")
          .select("id, product_name, product_price")
          .in("id", orderItemIds);

        if (orderItemsError) throw orderItemsError;

        const orderItemsMap = new Map(
          orderItemsData?.map((oi) => [oi.id, oi]) || []
        );

        const enrichedItems = itemsData.map((item) => ({
          ...item,
          product_name: orderItemsMap.get(item.order_item_id)?.product_name || "N/A",
          product_price: orderItemsMap.get(item.order_item_id)?.product_price || 0,
        }));

        setReturnItems(enrichedItems);
      } else {
        setReturnItems([]);
      }
    } catch (error) {
      console.error("Error fetching return items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch return items",
        variant: "destructive",
      });
    } finally {
      setItemsLoading(false);
    }
  };

  const handleApproveReturn = async () => {
    if (!selectedReturn) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("returns")
        .update({
          status: "approved",
          admin_notes: adminNotes || null,
        })
        .eq("id", selectedReturn.id);

      if (error) throw error;

      toast({
        title: "Return Approved",
        description: "Return request has been approved",
      });

      fetchReturns();
      setIsDetailDialogOpen(false);
    } catch (error) {
      console.error("Error approving return:", error);
      toast({
        title: "Error",
        description: "Failed to approve return",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectReturn = async () => {
    if (!selectedReturn) return;

    if (!adminNotes.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("returns")
        .update({
          status: "rejected",
          admin_notes: adminNotes,
        })
        .eq("id", selectedReturn.id);

      if (error) throw error;

      toast({
        title: "Return Rejected",
        description: "Return request has been rejected",
      });

      fetchReturns();
      setIsDetailDialogOpen(false);
    } catch (error) {
      console.error("Error rejecting return:", error);
      toast({
        title: "Error",
        description: "Failed to reject return",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkAsReceived = async () => {
    if (!selectedReturn) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("returns")
        .update({
          status: "received",
          admin_notes: adminNotes || null,
        })
        .eq("id", selectedReturn.id);

      if (error) throw error;

      // Restock items if approved
      if (selectedReturn.status === "approved") {
        for (const item of returnItems) {
          try {
            // Get product details from order_items
            const { data: orderItem } = await supabase
              .from("order_items")
              .select("product_id")
              .eq("id", item.order_item_id)
              .single();

            if (orderItem) {
              // Get current stock
              const { data: product } = await supabase
                .from("products")
                .select("stock_quantity")
                .eq("id", orderItem.product_id)
                .single();

              if (product) {
                const newQuantity = product.stock_quantity + item.quantity;

                // Update stock
                await supabase
                  .from("products")
                  .update({ stock_quantity: newQuantity })
                  .eq("id", orderItem.product_id);

                // Log inventory change
                await supabase.from("inventory_history").insert({
                  product_id: orderItem.product_id,
                  quantity_change: item.quantity,
                  new_quantity: newQuantity,
                  reason: "return",
                  notes: `Restocked from return ${selectedReturn.id}`,
                });
              }
            }
          } catch (restockError) {
            console.error("Error restocking item:", restockError);
          }
        }
      }

      toast({
        title: "Return Received",
        description: "Return has been marked as received and items restocked",
      });

      fetchReturns();
      setIsDetailDialogOpen(false);
    } catch (error) {
      console.error("Error marking as received:", error);
      toast({
        title: "Error",
        description: "Failed to mark as received",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!selectedReturn) return;

    const amount = parseFloat(refundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid refund amount",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("returns")
        .update({
          status: "refunded",
          refund_amount: amount,
          admin_notes: adminNotes || null,
        })
        .eq("id", selectedReturn.id);

      if (error) throw error;

      toast({
        title: "Refund Processed",
        description: `Refund of ₹${amount} has been processed`,
      });

      fetchReturns();
      setIsDetailDialogOpen(false);
    } catch (error) {
      console.error("Error processing refund:", error);
      toast({
        title: "Error",
        description: "Failed to process refund",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const exportReturns = () => {
    const csvContent = [
      ["Return ID", "Order Number", "Customer", "Email", "Amount", "Status", "Reason", "Date"].join(","),
      ...filteredReturns.map((ret) => [
        ret.id,
        ret.order_number || "N/A",
        `"${ret.customer_name}"`,
        ret.customer_email,
        ret.refund_amount,
        ret.status || "requested",
        `"${ret.reason}"`,
        new Date(ret.created_at).toLocaleDateString(),
      ].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `returns_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const requestedCount = returns.filter((r) => !r.status || r.status === "requested").length;
  const approvedCount = returns.filter((r) => r.status === "approved").length;
  const refundedCount = returns.filter((r) => r.status === "refunded").length;

  if (loading) {
    return <div className="p-4">Loading returns...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Returns & Refunds
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredReturns.length} of {returns.length} return requests
          </p>
        </div>
        <Button
          onClick={exportReturns}
          variant="outline"
          className="rounded-2xl border-slate-200 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-md hover:shadow-xl"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Returns
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">{requestedCount}</p>
            </div>
            <RotateCcw className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Approved</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{approvedCount}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Refunded</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{refundedCount}</p>
            </div>
            <DollarSign className="h-10 w-10 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order number, customer name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-slate-200"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] rounded-xl border-slate-200">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="requested">Requested</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Returns Table */}
      <div className="border border-slate-200 rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-slate-50/50">
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReturns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No return requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredReturns.map((ret) => (
                <TableRow key={ret.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">{ret.order_number}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ret.customer_name}</p>
                      <p className="text-xs text-gray-500">{ret.customer_email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{ret.reason}</TableCell>
                  <TableCell className="font-bold">₹{ret.refund_amount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ret.status)}>
                      {ret.status?.charAt(0).toUpperCase() + (ret.status?.slice(1) || "Requested")}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(ret.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailDialog(ret)}
                      className="rounded-xl hover:bg-blue-500 hover:text-white"
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Return Request Details</DialogTitle>
          </DialogHeader>

          {selectedReturn && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-bold">{selectedReturn.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-bold">{selectedReturn.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-blue-600">{selectedReturn.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={getStatusColor(selectedReturn.status)}>
                      {selectedReturn.status?.toUpperCase() || "REQUESTED"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Return Reason */}
              <div>
                <Label>Return Reason</Label>
                <p className="mt-2 p-3 bg-gray-50 rounded-xl">{selectedReturn.reason}</p>
              </div>

              {/* Return Items */}
              <div>
                <Label>Items to Return</Label>
                {itemsLoading ? (
                  <p className="text-sm text-gray-500 mt-2">Loading items...</p>
                ) : (
                  <div className="mt-2 space-y-2">
                    {returnItems.map((item) => (
                      <div key={item.id} className="bg-gray-50 p-3 rounded-xl flex justify-between">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-bold">₹{(item.product_price || 0) * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Refund Amount */}
              <div>
                <Label>Refund Amount</Label>
                <Input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="Enter refund amount..."
                  className="rounded-xl mt-1"
                  disabled={selectedReturn.status === "refunded"}
                />
              </div>

              {/* Admin Notes */}
              <div>
                <Label>Admin Notes</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes for this return request..."
                  className="rounded-xl mt-1"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {(!selectedReturn.status || selectedReturn.status === "requested") && (
                  <>
                    <Button
                      type="button"
                      onClick={handleApproveReturn}
                      disabled={processing}
                      className="rounded-xl bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {processing ? "Processing..." : "Approve Return"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleRejectReturn}
                      disabled={processing}
                      variant="destructive"
                      className="rounded-xl"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {processing ? "Processing..." : "Reject Return"}
                    </Button>
                  </>
                )}

                {selectedReturn.status === "approved" && (
                  <Button
                    type="button"
                    onClick={handleMarkAsReceived}
                    disabled={processing}
                    className="rounded-xl bg-purple-500 hover:bg-purple-600"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {processing ? "Processing..." : "Mark as Received & Restock"}
                  </Button>
                )}

                {(selectedReturn.status === "received" || selectedReturn.status === "approved") &&
                  selectedReturn.status !== "refunded" && (
                    <Button
                      type="button"
                      onClick={handleProcessRefund}
                      disabled={processing}
                      className="rounded-xl bg-blue-500 hover:bg-blue-600"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      {processing ? "Processing..." : "Process Refund"}
                    </Button>
                  )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReturnsTab;
