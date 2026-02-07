import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Package, AlertTriangle, Plus, Minus, History, Download, Search, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  sku: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  price: number;
  primary_image: string | null;
  category: string | null;
}

interface InventoryHistory {
  id: string;
  product_id: number;
  quantity_change: number;
  new_quantity: number;
  reason: string;
  notes: string | null;
  created_at: string;
  user_id: string | null;
}

const InventoryTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [migrationNeeded, setMigrationNeeded] = useState(false);

  // Adjust stock dialog
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "subtract">("add");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("restock");
  const [adjustmentNotes, setAdjustmentNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  // History dialog
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);
  const [inventoryHistory, setInventoryHistory] = useState<InventoryHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, stockFilter]);

  const fetchProducts = async () => {
    try {
      // First try to fetch with inventory columns
      let { data, error } = await supabase
        .from("products")
        .select("id, name, sku, stock_quantity, low_stock_threshold, price, primary_image, category")
        .order("name");

      // If inventory columns don't exist, fetch basic product info and add default values
      if (error && error.message?.includes("does not exist")) {
        console.log("Inventory columns not found, fetching basic product info...");
        setMigrationNeeded(true);

        const basicFetch = await supabase
          .from("products")
          .select("id, name, price, primary_image, category")
          .order("name");

        if (basicFetch.error) throw basicFetch.error;

        // Add default inventory values
        data = basicFetch.data?.map(product => ({
          ...product,
          sku: null,
          stock_quantity: 0,
          low_stock_threshold: 5,
        })) || [];

        toast({
          title: "Inventory System Not Set Up",
          description: "Please apply the inventory management migration (20260128000100_add_inventory_management.sql) in your Supabase dashboard to enable full inventory features.",
          variant: "destructive",
        });
      } else if (error) {
        throw error;
      } else {
        setMigrationNeeded(false);
      }

      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to fetch products. Please check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.sku?.toLowerCase().includes(query)
      );
    }

    // Apply stock filter
    if (stockFilter === "low") {
      filtered = filtered.filter(
        (product) => product.stock_quantity <= product.low_stock_threshold && product.stock_quantity > 0
      );
    } else if (stockFilter === "out") {
      filtered = filtered.filter((product) => product.stock_quantity === 0);
    } else if (stockFilter === "in") {
      filtered = filtered.filter(
        (product) => product.stock_quantity > product.low_stock_threshold
      );
    }

    setFilteredProducts(filtered);
  };

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) {
      return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    } else if (product.stock_quantity <= product.low_stock_threshold) {
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    } else {
      return { label: "In Stock", color: "bg-green-100 text-green-800" };
    }
  };

  const openAdjustDialog = (product: Product) => {
    setSelectedProduct(product);
    setAdjustmentType("add");
    setAdjustmentQuantity("");
    setAdjustmentReason("restock");
    setAdjustmentNotes("");
    setIsAdjustDialogOpen(true);
  };

  const handleAdjustStock = async () => {
    if (!selectedProduct || !adjustmentQuantity) {
      toast({
        title: "Error",
        description: "Please enter a quantity",
        variant: "destructive",
      });
      return;
    }

    const quantity = parseInt(adjustmentQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);

    try {
      const quantityChange = adjustmentType === "add" ? quantity : -quantity;
      const newQuantity = Math.max(0, selectedProduct.stock_quantity + quantityChange);

      // Update product stock
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_quantity: newQuantity })
        .eq("id", selectedProduct.id);

      if (updateError) throw updateError;

      // Add inventory history entry
      const { error: historyError } = await supabase
        .from("inventory_history")
        .insert({
          product_id: selectedProduct.id,
          quantity_change: quantityChange,
          new_quantity: newQuantity,
          reason: adjustmentReason,
          notes: adjustmentNotes || null,
        });

      if (historyError) {
        console.error("Error adding history:", historyError);
      }

      toast({
        title: "Stock Updated",
        description: `${selectedProduct.name} stock ${adjustmentType === "add" ? "increased" : "decreased"} by ${quantity}`,
      });

      // Refresh products
      fetchProducts();
      setIsAdjustDialogOpen(false);
    } catch (error) {
      console.error("Error adjusting stock:", error);
      toast({
        title: "Error",
        description: "Failed to adjust stock",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const openHistoryDialog = async (product: Product) => {
    setHistoryProduct(product);
    setIsHistoryDialogOpen(true);
    setHistoryLoading(true);

    try {
      const { data, error } = await supabase
        .from("inventory_history")
        .select("*")
        .eq("product_id", product.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setInventoryHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch inventory history",
        variant: "destructive",
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  const exportInventory = () => {
    const csvContent = [
      ["Product Name", "SKU", "Stock Quantity", "Low Stock Threshold", "Status", "Price", "Category"].join(","),
      ...filteredProducts.map((product) => {
        const status = getStockStatus(product).label;
        return [
          `"${product.name}"`,
          product.sku || "N/A",
          product.stock_quantity,
          product.low_stock_threshold,
          status,
          product.price,
          product.category || "N/A",
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lowStockCount = products.filter(
    (p) => p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0
  ).length;
  const outOfStockCount = products.filter((p) => p.stock_quantity === 0).length;

  if (loading) {
    return <div className="p-4">Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Inventory Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredProducts.length} of {products.length} products
          </p>
        </div>
        <Button
          onClick={exportInventory}
          variant="outline"
          className="rounded-2xl border-slate-200 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-md hover:shadow-xl"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Inventory
        </Button>
      </div>

      {/* Migration Warning Banner */}
      {migrationNeeded && (
        <Alert className="border-amber-300 bg-amber-50 rounded-2xl">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900 font-semibold">Database Migration Required</AlertTitle>
          <AlertDescription className="text-amber-800">
            To enable full inventory management features (stock tracking, SKUs, low stock alerts), please apply the migration file{" "}
            <code className="bg-amber-200 px-2 py-1 rounded text-sm">
              20260128000100_add_inventory_management.sql
            </code>
            {" "}in your Supabase dashboard. Products are displayed with default values until the migration is applied.
          </AlertDescription>
        </Alert>
      )}

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium">Low Stock Items</p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">{lowStockCount}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Out of Stock</p>
              <p className="text-3xl font-bold text-red-900 mt-2">{outOfStockCount}</p>
            </div>
            <Package className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Total Products</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{products.length}</p>
            </div>
            <Package className="h-10 w-10 text-green-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-slate-200"
          />
        </div>

        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-full sm:w-[200px] rounded-xl border-slate-200">
            <SelectValue placeholder="Filter by stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="in">In Stock</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      <div className="border border-slate-200 rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-slate-50/50">
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const status = getStockStatus(product);
                return (
                  <TableRow key={product.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.primary_image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.sku || "—"}</TableCell>
                    <TableCell className="font-bold">{product.stock_quantity}</TableCell>
                    <TableCell>{product.low_stock_threshold}</TableCell>
                    <TableCell>
                      <Badge className={status.color}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAdjustDialog(product)}
                          className="rounded-xl hover:bg-blue-500 hover:text-white"
                        >
                          <Package className="h-4 w-4 mr-1" />
                          Adjust
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openHistoryDialog(product)}
                          className="rounded-xl hover:bg-purple-500 hover:text-white"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Adjust Stock Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Adjust Stock</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="font-medium">{selectedProduct.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Current Stock: <span className="font-bold">{selectedProduct.stock_quantity}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={adjustmentType === "add" ? "default" : "outline"}
                  onClick={() => setAdjustmentType("add")}
                  className="flex-1 rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stock
                </Button>
                <Button
                  type="button"
                  variant={adjustmentType === "subtract" ? "default" : "outline"}
                  onClick={() => setAdjustmentType("subtract")}
                  className="flex-1 rounded-xl"
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Remove Stock
                </Button>
              </div>

              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(e.target.value)}
                  placeholder="Enter quantity..."
                  className="rounded-xl mt-1"
                />
              </div>

              <div>
                <Label>Reason</Label>
                <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restock">Restock</SelectItem>
                    <SelectItem value="return">Customer Return</SelectItem>
                    <SelectItem value="adjustment">Manual Adjustment</SelectItem>
                    <SelectItem value="damaged">Damaged/Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={adjustmentNotes}
                  onChange={(e) => setAdjustmentNotes(e.target.value)}
                  placeholder="Add any additional notes..."
                  className="rounded-xl mt-1"
                  rows={3}
                />
              </div>

              <Button
                type="button"
                onClick={handleAdjustStock}
                disabled={updating}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {updating ? "Updating..." : "Update Stock"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Stock History</DialogTitle>
            {historyProduct && (
              <p className="text-sm text-gray-600 mt-1">{historyProduct.name}</p>
            )}
          </DialogHeader>

          {historyLoading ? (
            <div className="text-center py-8">Loading history...</div>
          ) : inventoryHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No history available</div>
          ) : (
            <div className="space-y-3">
              {inventoryHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            entry.quantity_change > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {entry.quantity_change > 0 ? "+" : ""}
                          {entry.quantity_change}
                        </Badge>
                        <span className="font-medium capitalize">{entry.reason}</span>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        New Stock: {entry.new_quantity}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(entry.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryTab;
