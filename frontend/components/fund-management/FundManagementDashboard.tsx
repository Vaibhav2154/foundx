'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { 
  // DollarSign removed
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Receipt, 
  Target, 
  AlertTriangle,
  Plus,
  FileText,
  CreditCard,
  Wallet,
  RefreshCw
} from 'lucide-react';
import { fundManagementService, DashboardData, Expense } from '@/api/fund-management';
import { showError } from '@/utils/toast';
import ExpenseManager from './ExpenseManager';

interface FundManagementDashboardProps {
  startUpId: string;
  startUpData?: any;
}

export default function FundManagementDashboard({ startUpId, startUpData }: FundManagementDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, [startUpId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await fundManagementService.getDashboardData(startUpId);
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    // Format as Indian Rupees
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden bg-blue-600/20 rounded-2xl border border-gray-700/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-gray-900 opacity-80"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                💰 Fund Management
              </h1>
              <p className="text-gray-300 text-lg">
                Track expenses, manage budgets, and monitor fundraising for {startUpData?.companyName || 'your startup'}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={loadDashboardData} variant="secondary" className="bg-gray-800 text-white border border-gray-700 hover:bg-gray-700">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      {dashboardData?.budgetAlerts && dashboardData.budgetAlerts.length > 0 && (
        <Card className="bg-orange-600/10 backdrop-blur-xl border border-orange-500/30">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-300">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Budget Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.budgetAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div>
                    <p className="font-medium text-white">{alert.budgetName} - {alert.category}</p>
                    <p className="text-sm text-gray-400">
                      Budget utilization: {alert.utilizationRate.toFixed(1)}%
                    </p>
                  </div>
                  <Badge 
                    variant={alert.severity === 'Critical' ? 'destructive' : 'secondary'}
                  >
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Monthly Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(dashboardData?.monthlyExpenses.total || 0)}
            </div>
            <p className="text-xs text-gray-400">
              {dashboardData?.monthlyExpenses.count || 0} transactions this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Budgets</CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboardData?.activeBudgets || 0}</div>
            <p className="text-xs text-gray-400">Currently tracking</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Funding</CardTitle>
            <Wallet className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {formatCurrency(dashboardData?.totalFunding || 0)}
            </div>
            <p className="text-xs text-gray-400">Received funding</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Recent Activity</CardTitle>
            <FileText className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {dashboardData?.recentTransactions.length || 0}
            </div>
            <p className="text-xs text-gray-400">Recent transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
          <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-blue-600/50">
            Overview
          </TabsTrigger>
          <TabsTrigger value="expenses" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-blue-600/50">
            Expenses
          </TabsTrigger>
          {/* <TabsTrigger value="budgets" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-blue-600/50">
            Budgets
          </TabsTrigger>
          <TabsTrigger value="funding" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-blue-600/50">
            Funding
          </TabsTrigger>
          <TabsTrigger value="fundraising" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-blue-600/50">
            Fundraising
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-blue-600/50">
            Reports
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Receipt className="mr-2 h-5 w-5 text-blue-400" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData?.recentTransactions.map((transaction) => (
                    <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg backdrop-blur-sm">
                      <div>
                        <p className="font-medium text-white">{transaction.title}</p>
                        <div className="flex items-center space-x-2 text-sm text-white">
                          <Badge variant="outline" className=" text-white">{transaction.category}</Badge>
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg text-green-400">
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge 
                          variant={transaction.status === 'Approved' ? 'default' : 'secondary'}
                          className={transaction.status === 'Approved' ? 'bg-green-600/20 text-green-300 border-green-500/50' : 'bg-gray-600/20 text-gray-300 border-gray-500/50'}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {(!dashboardData?.recentTransactions || dashboardData.recentTransactions.length === 0) && (
                    <p className="text-center text-gray-400 py-8">No recent transactions</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Expense Chart */}
            <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <PieChart className="mr-2 h-5 w-5 text-purple-400" />
                  Expense Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.monthlyExpenses.transactions && dashboardData.monthlyExpenses.transactions.length > 0 ? (
                  <div className="space-y-2">
                    {dashboardData.monthlyExpenses.transactions.slice(0, 3).map((expense) => (
                      <div key={expense._id} className="flex justify-between items-center p-2 bg-gray-700/50 border-gray-500 rounded">
                        <div>
                          <p className="font-medium">{expense.category}</p>
                          <p className="text-sm text-gray-600">{expense.title}</p>
                        </div>
                        <p className="font-semibold text-green-400">{formatCurrency(expense.amount)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 text-gray-500">
                    <div className="text-center">
                      <PieChart className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No expense data to display</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseManager startUpId={startUpId} onUpdate={loadDashboardData} />
        </TabsContent>

        <TabsContent value="budgets">
          <Card>
            <CardHeader>
              <CardTitle>Budget Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Budget management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funding">
          <Card>
            <CardHeader>
              <CardTitle>Funding Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Funding management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fundraising">
          <Card>
            <CardHeader>
              <CardTitle>Fundraising Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Fundraising management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Financial reporting features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
