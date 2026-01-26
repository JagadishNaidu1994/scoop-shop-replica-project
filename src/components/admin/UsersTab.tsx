
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface User {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  phone: string | null;
  gender: string | null;
  total_orders: number;
  total_spent: number;
  addresses_count: number;
}

interface Address {
  id: string;
  full_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  is_default: boolean | null;
}

const UsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch users from profiles table
      const { data: profilesData, error } = await supabase
        .from("profiles")
        .select("*");
      
      if (error) throw error;
      
      // Fetch additional data for each user efficiently
      const enrichedUsers = await Promise.all(
        (profilesData || []).map(async (profile) => {
          // Get orders count and total spent
          const { data: orders } = await supabase
            .from("orders")
            .select("total_amount")
            .eq("user_id", profile.id);
          
          // Get addresses count
          const { data: addresses } = await supabase
            .from("addresses")
            .select("id")
            .eq("user_id", profile.id);
          
          const totalOrders = orders?.length || 0;
          const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
          const addressesCount = addresses?.length || 0;
          
          return {
            id: profile.id,
            email: profile.email,
            first_name: profile.first_name,
            last_name: profile.last_name,
            created_at: profile.created_at || new Date().toISOString(),
            phone: profile.phone,
            gender: profile.gender,
            total_orders: totalOrders,
            total_spent: totalSpent,
            addresses_count: addressesCount,
          };
        })
      );
      
      setUsers(enrichedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data: addresses, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId);
      
      if (error) throw error;
      setUserAddresses(addresses || []);
    } catch (error) {
      console.error("Error fetching user addresses:", error);
      setUserAddresses([]);
    }
  };

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    await fetchUserDetails(user.id);
    setUserDetailOpen(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportUsers = () => {
    const csv = [
      ["User ID", "First Name", "Last Name", "Email", "Joined Date"],
      ...filteredUsers.map((user) => [
        user.id,
        user.first_name || "",
        user.last_name || "",
        user.email || "",
        new Date(user.created_at).toLocaleDateString(),
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Users</h2>
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm rounded-2xl border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
        <Button onClick={handleExportUsers} className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
          Export to CSV
        </Button>
      </div>
      <div className="overflow-x-auto border border-slate-200 rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-slate-50/50 transition-colors duration-200">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Addresses</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                  <TableCell>
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user.first_name || user.last_name || "N/A"}
                  </TableCell>
                  <TableCell>{user.email || "N/A"}</TableCell>
                  <TableCell>{user.phone || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-2xl">{user.total_orders}</Badge>
                  </TableCell>
                  <TableCell>₹{user.total_spent.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-2xl">{user.addresses_count}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewUser(user)}
                        className="rounded-2xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:border-transparent transition-all duration-300"
                      >
                        <FaEye />
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-2xl hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white hover:border-transparent transition-all duration-300">
                        <FaEdit />
                      </Button>
                      <Button size="sm" variant="destructive" className="rounded-2xl hover:shadow-lg transition-all duration-300">
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

      {/* User Detail Dialog */}
      <Dialog open={userDetailOpen} onOpenChange={setUserDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl border-slate-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">
                      {selectedUser.first_name && selectedUser.last_name
                        ? `${selectedUser.first_name} ${selectedUser.last_name}`
                        : selectedUser.first_name || selectedUser.last_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedUser.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedUser.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium">{selectedUser.gender || "N/A"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Statistics */}
              <div>
                <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Order Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <p className="text-2xl font-bold text-blue-600">{selectedUser.total_orders}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <p className="text-2xl font-bold text-green-600">₹{selectedUser.total_spent.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{selectedUser.total_orders > 0 ? (selectedUser.total_spent / selectedUser.total_orders).toFixed(2) : "0.00"}
                    </p>
                    <p className="text-sm text-gray-600">Avg Order Value</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Addresses */}
              <div>
                <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Addresses ({userAddresses.length})</h3>
                {userAddresses.length > 0 ? (
                  <div className="space-y-3">
                    {userAddresses.map((address) => (
                      <div key={address.id} className="p-4 border border-slate-200 rounded-2xl bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{address.full_name}</p>
                          {address.is_default && (
                            <Badge variant="default" className="text-xs rounded-2xl">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.address_line1}
                          {address.address_line2 && `, ${address.address_line2}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No addresses found</p>
                )}
              </div>

              <Separator />

              {/* Account Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Account Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Status</p>
                    <Badge variant="outline" className="text-green-600 rounded-2xl">Active</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersTab;
