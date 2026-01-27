import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  base_rate: number;
  estimated_days: string;
  is_active: boolean;
}

const ShippingTab = () => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    base_rate: "",
    estimated_days: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const fetchShippingMethods = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("shipping_methods")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setShippingMethods(data || []);
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      base_rate: "",
      estimated_days: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const shippingData = {
        name: form.name,
        description: form.description,
        base_rate: parseFloat(form.base_rate),
        estimated_days: form.estimated_days,
      };

      if (editingMethod) {
        const { error } = await supabase
          .from("shipping_methods")
          .update(shippingData)
          .eq("id", editingMethod.id);
        if (error) throw error;
        toast({ title: "Success", description: "Shipping method updated." });
      } else {
        const { error } = await supabase
          .from("shipping_methods")
          .insert([shippingData]);
        if (error) throw error;
        toast({ title: "Success", description: "Shipping method created." });
      }

      setIsModalOpen(false);
      setEditingMethod(null);
      resetForm();
      await fetchShippingMethods();
    } catch (error) {
      console.error("Error saving shipping method:", error);
      toast({
        title: "Error",
        description: "Failed to save shipping method.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (method: ShippingMethod) => {
    setEditingMethod(method);
    setForm({
      name: method.name,
      description: method.description || "",
      base_rate: method.base_rate.toString(),
      estimated_days: method.estimated_days,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (methodId: string) => {
    if (!confirm("Are you sure you want to delete this shipping method?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("shipping_methods")
        .delete()
        .eq("id", methodId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Shipping method deleted successfully.",
      });
      
      await fetchShippingMethods();
    } catch (error) {
      console.error("Error deleting shipping method:", error);
      toast({
        title: "Error",
        description: "Failed to delete shipping method.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Shipping Methods</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingMethod(null);
              resetForm();
            }} className="rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg">
              <FaPlus className="mr-2" />
              Add Method
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl border-slate-200 shadow-2xl bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {editingMethod ? "Edit Shipping Method" : "Add Shipping Method"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <Label htmlFor="base_rate">Base Rate (₹)</Label>
                <Input
                  id="base_rate"
                  type="number"
                  step="0.01"
                  value={form.base_rate}
                  onChange={(e) => setForm({ ...form, base_rate: e.target.value })}
                  required
                  className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <Label htmlFor="estimated_days">Estimated Days</Label>
                <Input
                  id="estimated_days"
                  value={form.estimated_days}
                  onChange={(e) => setForm({ ...form, estimated_days: e.target.value })}
                  required
                  className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-2xl"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800">
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-3xl shadow-xl border border-slate-200 overflow-hidden bg-white/80 backdrop-blur-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Base Rate</TableHead>
              <TableHead>Estimated Days</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              shippingMethods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell>{method.name}</TableCell>
                  <TableCell>{method.description}</TableCell>
                  <TableCell>₹{method.base_rate.toFixed(2)}</TableCell>
                  <TableCell>{method.estimated_days}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-2xl text-xs ${
                      method.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {method.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(method)}
                        className="rounded-2xl"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(method.id)}
                        className="rounded-2xl"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ShippingTab;
