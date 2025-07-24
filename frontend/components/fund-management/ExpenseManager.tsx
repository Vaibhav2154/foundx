"use client";

import ReceiptFileUploadButton from './ReceiptFileUploadButton';
// Removed duplicate handleReceiptFileUpload from top-level scope


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Receipt,
  Plus,
  Filter,
  Upload,
  Edit,
  Trash2,
  Search,
  Download
} from 'lucide-react';
import { fundManagementService, Expense } from '@/api/fund-management';
import { showSuccess, showError } from '@/utils/toast';

interface ExpenseManagerProps {
  startUpId: string;
  onUpdate?: () => void;
}

export default function ExpenseManager({ startUpId, onUpdate }: ExpenseManagerProps) {
  const handleReceiptFileUpload = async (file: File) => {
    // Upload file directly to Python backend, then create expense in Node backend
    try {
      // Upload to Python backend
      const formData = new FormData();
      formData.append('files', file);
      formData.append('bill_type', 'receipt');
      formData.append('extract_text_only', 'false');

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_URL}/bill-parser/parse-from-files`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to parse receipt file');
      const parsed = await response.json();
      const receiptInfo = parsed.results?.[0];
      if (!receiptInfo) throw new Error('No receipt info returned');

      // Prepare expense data for Node backend
      const expenseData = {
        title: receiptInfo.vendor_name || 'Receipt Expense',
        description: `Auto-generated from receipt|| ''}`,
        amount: receiptInfo.total_amount || 0,
        category: 'Miscellaneous',
        vendor: {
          name: receiptInfo.vendor_name,
          contact: receiptInfo.vendor_contact,
          address: receiptInfo.vendor_address,
        },
        date: receiptInfo.bill_date || new Date().toISOString(),
        receiptData: {
          confidence: receiptInfo.confidence,
          extractedText: receiptInfo.extracted_text,
          billType: receiptInfo.bill_type,
        },
        receiptUrl: receiptInfo.receipt_url, // If Python returns a file URL
        tags: [],
        isRecurring: false,
      };

      await fundManagementService.createExpense(startUpId, expenseData);
      showSuccess('Expense created from receipt file successfully');
      loadExpenses();
      onUpdate?.();
    } catch (error) {
      console.error('Error creating expense from receipt file:', error);
      showError('Failed to process receipt file');
    }
  };
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    startDate: '',
    endDate: '',
    searchTerm: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    loadExpenses();
  }, [startUpId, filters, pagination.page]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const response = await fundManagementService.getExpenses(startUpId, {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'date',
        sortOrder: 'desc'
      });
      setExpenses(response.expenses);
      setPagination(prev => ({ ...prev, ...response.pagination }));
    } catch (error) {
      console.error('Error loading expenses:', error);
      showError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (expenseData: Partial<Expense>) => {
    try {
      await fundManagementService.createExpense(startUpId, expenseData);
      showSuccess('Expense created successfully');
      setShowAddForm(false);
      loadExpenses();
      onUpdate?.();
    } catch (error) {
      console.error('Error creating expense:', error);
      showError('Failed to create expense');
    }
  };

  // const handleReceiptUpload = async (receiptData: string) => {
  //   try {
  //     await fundManagementService.createExpenseFromReceipt(startUpId, receiptData);
  //     showSuccess('Expense created from receipt successfully');
  //     loadExpenses();
  //     onUpdate?.();
  //   } catch (error) {
  //     console.error('Error creating expense from receipt:', error);
  //     showError('Failed to process receipt');
  //   }
  // };

  const categories = fundManagementService.getExpenseCategories();

  const formatCurrency = (amount: number) => {
    return fundManagementService.formatCurrency(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Pending': 'secondary',
      'Approved': 'default',
      'Rejected': 'destructive',
      'Reimbursed': 'default'
    } as const;
    return variants[status as keyof typeof variants] || 'secondary';
  };

  if (loading && expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Expense Management</h2>
          <p className="text-gray-600">Track and manage your startup expenses</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowAddForm(true)}
            variant="primary"
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
          <ReceiptFileUploadButton onUpload={handleReceiptFileUpload} />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 text-white"
                style={{ backgroundColor: 'gray', color: '#fff' }} // Tailwind blue-900
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'gray', color: '#fff' }} // Tailwind blue-900

              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Reimbursed">Reimbursed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'gray', color: '#fff' }} // Tailwind blue-900

              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'gray', color: '#fff' }} // Tailwind blue-900

              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense._id} className="flex items-center justify-between p-4 rounded-lg border-gray-400 border">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{expense.title}</h3>
                        <Badge variant={getStatusBadge(expense.status)}>
                          {expense.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-white">
                          {expense.category}
                        </Badge>
                      </div>
                      {expense.description && (
                        <p className="text-gray mt-1">{expense.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray">
                        <span>Date: {new Date(expense.date).toLocaleDateString()}</span>
                        <span>Method: {expense.paymentMethod}</span>
                        {expense.vendor?.name && (
                          <span>Vendor: {expense.vendor.name}</span>
                        )}
                      </div>
                      {expense.tags && expense.tags.length > 0 && (
                        <div className="flex items-center space-x-2 mt-2 text-white">
                          {expense.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-white">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ₹{formatCurrency(expense.amount)}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Receipt className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses found</h3>
              <p className="text-gray-600 mb-4">
                {Object.values(filters).some(v => v)
                  ? 'Try adjusting your filters to see more expenses.'
                  : 'Start by adding your first expense or uploading a receipt.'
                }
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                variant="primary"
              >
                Add Your First Expense
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} expenses
          </p>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              disabled={pagination.page <= 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddForm && (
        <AddExpenseModal
          onClose={() => setShowAddForm(false)}
          onSave={handleCreateExpense}
          categories={categories}
        />
      )}
    </div>
  );
}

// Receipt Upload Button Component
function ReceiptUploadButton({ onUpload }: { onUpload: (receiptData: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Please upload an image file');
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onUpload(result);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showError('Failed to upload receipt');
      setUploading(false);
    }

    // Reset input
    event.target.value = '';
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="receipt-upload"
      />
      <Button
        variant="secondary"
        onClick={() => document.getElementById('receipt-upload')?.click()}
        disabled={uploading}
        className="flex items-center"
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? 'Processing...' : 'Upload Receipt'}
      </Button>
    </div>
  );
}

// Add Expense Modal Component
function AddExpenseModal({
  onClose,
  onSave,
  categories
}: {
  onClose: () => void;
  onSave: (data: Partial<Expense>) => void;
  categories: string[];
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: '',
    subcategory: '',
    paymentMethod: 'Other',
    vendorName: '',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const expenseData: Partial<Expense> = {
      title: formData.title,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      subcategory: formData.subcategory,
      paymentMethod: formData.paymentMethod,
      vendor: formData.vendorName ? { name: formData.vendorName } : undefined,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
    };

    onSave(expenseData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-blue-950 rounded-lg w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Expense</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gay mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray mb-1">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray mb-1">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: '#2563eb', color: '#fff' }} // Tailwind blue-900
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
