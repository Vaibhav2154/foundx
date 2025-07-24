import api from "@/config/api";


export interface Expense {
  _id: string;
  title: string;
  description?: string;
  amount: number;
  category: string;
  subcategory?: string;
  date: string;
  paymentMethod: string;
  vendor?: {
    name?: string;
    contact?: string;
    address?: string;
  };
  receiptUrl?: string;
  receiptData?: {
    confidence: number;
    extractedText: string;
    billType: string;
  };
  tags: string[];
  isRecurring: boolean;
  recurringFrequency?: string;
  project?: string;
  startUp: string;
  createdBy: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  _id: string;
  name: string;
  description?: string;
  totalAmount: number;
  period: string;
  startDate: string;
  endDate: string;
  categories: Array<{
    category: string;
    allocatedAmount: number;
    spentAmount: number;
    remainingAmount: number;
  }>;
  alertThreshold: number;
  status: string;
  startUp: string;
  project?: string;
  createdBy: any;
  createdAt: string;
  updatedAt: string;
}

export interface FundingSource {
  _id: string;
  name: string;
  type: string;
  amount: number;
  currency: string;
  receivedAmount: number;
  remainingAmount: number;
  dateReceived?: string;
  expectedDate?: string;
  terms?: {
    equityPercentage?: number;
    valuationCap?: number;
    interestRate?: number;
    paybackPeriod?: number;
    conditions?: string[];
  };
  investor?: {
    name?: string;
    contact?: string;
    type?: string;
  };
  status: string;
  documents?: Array<{
    type: string;
    description: string;
    url: string;
  }>;
  startUp: string;
  createdBy: any;
  createdAt: string;
  updatedAt: string;
}

export interface FundraisingCampaign {
  _id: string;
  name: string;
  description?: string;
  type: string;
  targetAmount: number;
  raisedAmount: number;
  currency: string;
  valuation?: {
    pre?: number;
    post?: number;
  };
  startDate: string;
  targetCloseDate?: string;
  status: string;
  investors: Array<{
    name: string;
    type?: string;
    contactInfo?: string;
    commitedAmount?: number;
    status: string;
    lastContact?: string;
    notes?: string;
  }>;
  milestones: Array<{
    name: string;
    description?: string;
    targetDate?: string;
    completed: boolean;
    completedDate?: string;
  }>;
  documents: Array<{
    type: string;
    name: string;
    url: string;
    version?: string;
  }>;
  metrics?: {
    conversionRate?: number;
    averageInvestmentSize?: number;
    timeToClose?: number;
  };
  startUp: string;
  createdBy: any;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialReport {
  _id: string;
  title: string;
  type: string;
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netCashFlow: number;
    budgetUtilization: number;
  };
  categoryBreakdown: Array<{
    category: string;
    budgeted: number;
    spent: number;
    variance: number;
    percentage: number;
  }>;
  insights: Array<{
    type: string;
    message: string;
    severity: string;
  }>;
  startUp: string;
  generatedBy: any;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseAnalytics {
  categoryAnalytics: Array<{
    _id: string;
    totalAmount: number;
    count: number;
    averageAmount: number;
  }>;
  monthlyTrend: Array<{
    _id: { year: number; month: number };
    totalAmount: number;
    count: number;
  }>;
  recentExpenses: Expense[];
}

export interface DashboardData {
  monthlyExpenses: {
    total: number;
    count: number;
    transactions: Expense[];
  };
  activeBudgets: number;
  totalFunding: number;
  recentTransactions: Expense[];
  budgetAlerts: Array<{
    budgetName: string;
    category: string;
    utilizationRate: number;
    severity: string;
  }>;
}

class FundManagementService {
  async createExpenseFromReceiptFile(startUpId: string, file: File): Promise<Expense> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(
      `${this.baseUrl}/startup/${startUpId}/expenses/from-receipt-file`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data;
  }
  private baseUrl = '/funds';


  async createExpense(startUpId: string, expenseData: Partial<Expense>): Promise<Expense> {
    const response = await api.post(`${this.baseUrl}/startup/${startUpId}/expenses`, expenseData);
    return response.data.data;
  }

  async createExpenseFromReceipt(startUpId: string, receiptData: string): Promise<Expense> {
    const response = await api.post(`${this.baseUrl}/startup/${startUpId}/expenses/from-receipt`, {
      receiptData
    });
    return response.data.data;
  }

  async getExpenses(
    startUpId: string,
    filters?: {
      category?: string;
      startDate?: string;
      endDate?: string;
      status?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<{ expenses: Expense[]; pagination: any }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`${this.baseUrl}/startup/${startUpId}/expenses?${params}`);
    return response.data.data;
  }

  async getExpenseAnalytics(startUpId: string, period: string = 'monthly'): Promise<ExpenseAnalytics> {
    const response = await api.get(`${this.baseUrl}/startup/${startUpId}/expenses/analytics?period=${period}`);
    return response.data.data;
  }


  async createBudget(startUpId: string, budgetData: Partial<Budget>): Promise<Budget> {
    const response = await api.post(`${this.baseUrl}/startup/${startUpId}/budgets`, budgetData);
    return response.data.data;
  }

  async getBudgets(
    startUpId: string,
    filters?: {
      status?: string;
      period?: string;
    }
  ): Promise<Budget[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
    }
    
    const response = await api.get(`${this.baseUrl}/startup/${startUpId}/budgets?${params}`);
    return response.data.data;
  }

  async updateBudgetSpending(budgetId: string, category: string, amount: number): Promise<Budget> {
    const response = await api.put(`${this.baseUrl}/budget/${budgetId}/spending`, {
      category,
      amount
    });
    return response.data.data;
  }

  async getBudgetVsActual(startUpId: string, budgetId?: string): Promise<any[]> {
    const params = budgetId ? `?budgetId=${budgetId}` : '';
    const response = await api.get(`${this.baseUrl}/startup/${startUpId}/budget-vs-actual${params}`);
    return response.data.data;
  }


  async createFundingSource(startUpId: string, fundingData: Partial<FundingSource>): Promise<FundingSource> {
    const response = await api.post(`${this.baseUrl}/startup/${startUpId}/funding-sources`, fundingData);
    return response.data.data;
  }

  async getFundingSources(
    startUpId: string,
    filters?: {
      type?: string;
      status?: string;
    }
  ): Promise<{ fundingSources: FundingSource[]; summary: any }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
    }
    
    const response = await api.get(`${this.baseUrl}/startup/${startUpId}/funding-sources?${params}`);
    return response.data.data;
  }


  async createFundraisingCampaign(startUpId: string, campaignData: Partial<FundraisingCampaign>): Promise<FundraisingCampaign> {
    const response = await api.post(`${this.baseUrl}/startup/${startUpId}/fundraising-campaigns`, campaignData);
    return response.data.data;
  }

  async getFundraisingCampaigns(
    startUpId: string,
    status?: string
  ): Promise<FundraisingCampaign[]> {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`${this.baseUrl}/startup/${startUpId}/fundraising-campaigns${params}`);
    return response.data.data;
  }

  async updateInvestorStatus(
    campaignId: string,
    investorIndex: number,
    updateData: {
      status: string;
      commitedAmount?: number;
      notes?: string;
    }
  ): Promise<FundraisingCampaign> {
    const response = await api.put(`${this.baseUrl}/fundraising-campaign/${campaignId}/investor`, {
      investorIndex,
      ...updateData
    });
    return response.data.data;
  }


  async generateFinancialReport(
    startUpId: string,
    reportData: {
      type: string;
      startDate: string;
      endDate: string;
    }
  ): Promise<FinancialReport> {
    const response = await api.post(`${this.baseUrl}/startup/${startUpId}/financial-reports`, reportData);
    return response.data.data;
  }

  async getFinancialReports(
    startUpId: string,
    type?: string
  ): Promise<FinancialReport[]> {
    const params = type ? `?type=${type}` : '';
    const response = await api.get(`${this.baseUrl}/startup/${startUpId}/financial-reports${params}`);
    return response.data.data;
  }


  async getDashboardData(startUpId: string): Promise<DashboardData> {
    const response = await api.get(`${this.baseUrl}/startup/${startUpId}/dashboard`);
    return response.data.data;
  }


  getExpenseCategories(): string[] {
    return [
      'Development',
      'Marketing',
      'Operations',
      'Legal',
      'Equipment',
      'Travel',
      'Office',
      'Utilities',
      'Software',
      'Consulting',
      'Research',
      'Miscellaneous'
    ];
  }

  getFundingTypes(): string[] {
    return [
      'Bootstrapping',
      'Friends & Family',
      'Angel Investment',
      'Venture Capital',
      'Crowdfunding',
      'Government Grant',
      'Bank Loan',
      'Revenue',
      'Other'
    ];
  }

  getFundraisingTypes(): string[] {
    return ['Seed', 'Series A', 'Series B', 'Series C', 'Bridge', 'Crowdfunding', 'Grant'];
  }

  formatCurrency(amount: number, currency: string = 'USD'): string {
    const formatted = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
    }).format(amount);
    return formatted.slice(1);
  }

  calculateBudgetUtilization(budget: Budget): number {
    const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spentAmount, 0);
    return budget.totalAmount > 0 ? (totalSpent / budget.totalAmount) * 100 : 0;
  }

  getBudgetStatus(utilization: number, alertThreshold: number): {
    status: string;
    color: string;
    severity: 'success' | 'warning' | 'danger';
  } {
    if (utilization >= 100) {
      return { status: 'Over Budget', color: 'red', severity: 'danger' };
    } else if (utilization >= alertThreshold) {
      return { status: 'Alert Threshold', color: 'orange', severity: 'warning' };
    } else {
      return { status: 'On Track', color: 'green', severity: 'success' };
    }
  }

  calculateFundraisingProgress(campaign: FundraisingCampaign): {
    percentage: number;
    remaining: number;
    status: string;
  } {
    const percentage = campaign.targetAmount > 0 ? (campaign.raisedAmount / campaign.targetAmount) * 100 : 0;
    const remaining = campaign.targetAmount - campaign.raisedAmount;
    
    let status = 'In Progress';
    if (percentage >= 100) {
      status = 'Target Met';
    } else if (percentage >= 75) {
      status = 'Nearly Complete';
    } else if (percentage >= 50) {
      status = 'Good Progress';
    }

    return { percentage, remaining, status };
  }
}

export const fundManagementService = new FundManagementService();
export default fundManagementService;
