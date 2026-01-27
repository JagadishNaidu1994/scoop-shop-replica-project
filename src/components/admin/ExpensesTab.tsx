
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download, TrendingDown, Calendar } from 'lucide-react';

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

const ExpensesTab = () => {
  const [expenses] = useState<Expense[]>([
    {
      id: '1',
      date: '2024-01-15',
      description: 'Office Supplies',
      category: 'Operations',
      amount: 250.00,
      status: 'paid'
    },
    {
      id: '2',
      date: '2024-01-14',
      description: 'Marketing Campaign',
      category: 'Marketing',
      amount: 1500.00,
      status: 'pending'
    },
    {
      id: '3',
      date: '2024-01-13',
      description: 'Server Hosting',
      category: 'Technology',
      amount: 99.99,
      status: 'paid'
    }
  ]);

  const [newExpense, setNewExpense] = useState({
    description: '',
    category: '',
    amount: '',
    date: ''
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Expenses Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" className="rounded-2xl">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingExpenses}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{(totalExpenses / expenses.length).toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Per expense</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-3xl shadow-xl border border-slate-200 overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-2xl">{expense.category}</Badge>
                    </TableCell>
                    <TableCell>£{expense.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={expense.status === 'paid' ? 'default' : expense.status === 'pending' ? 'secondary' : 'destructive'}
                        className="rounded-2xl"
                      >
                        {expense.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Add New Expense</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) => setNewExpense({...newExpense, category: value})}
              >
                <SelectTrigger className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-teal-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount (£)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <Button className="w-full rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpensesTab;
