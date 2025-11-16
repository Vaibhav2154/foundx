import FormData from 'form-data';
import fetch from 'node-fetch';
// Parse receipt from uploaded file
export const createExpenseFromReceiptFile = asyncHandler(async (req, res) => {
    const { startUpId } = req.params;
    const serviceUrl = process.env.SERVICE_URL || 'https://foundx.onrender.com';
    if (!req.file) {
        throw new ApiError(400, 'No file uploaded');
    }
    // Prepare form-data for bill parser service
    const formData = new FormData();
    formData.append('files', req.file.buffer, req.file.originalname);
    formData.append('bill_type', 'receipt');
    formData.append('extract_text_only', 'false');

    const parseResponse = await fetch(`${serviceUrl}/api/v1/bill-parser/parse-from-files`, {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
    });
    if (!parseResponse.ok) {
        throw new ApiError(500, 'Failed to parse receipt file');
    }
    const parsed = await parseResponse.json();
    const receiptInfo = parsed.results[0];
    const expense = await Expense.create({
        title: receiptInfo.vendor_name || 'Receipt Expense',
        description: `Auto-generated from receipt - ${receiptInfo.bill_number || ''}`,
        amount: receiptInfo.total_amount || 0,
        category: 'Miscellaneous',
        vendor: {
            name: receiptInfo.vendor_name,
            contact: receiptInfo.vendor_contact,
            address: receiptInfo.vendor_address,
        },
        date: receiptInfo.bill_date ? new Date(receiptInfo.bill_date) : new Date(),
        receiptData: {
            confidence: receiptInfo.confidence,
            extractedText: receiptInfo.extracted_text,
            billType: receiptInfo.bill_type,
        },
        startUp: startUpId,
        createdBy: req.user._id,
    });
    res.status(201).json(new ApiResponse(201, expense, 'Expense created from receipt file successfully'));
});
import { Expense, Budget, FundingSource, FinancialReport, FundraisingCampaign } from '../models/fund.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';


export const createExpense = asyncHandler(async (req, res) => {
    const { title, description, amount, category, subcategory, vendor, paymentMethod, project, receiptUrl, tags, isRecurring, recurringFrequency } = req.body;
    const { startUpId } = req.params;

    const expense = await Expense.create({
        title,
        description,
        amount,
        category,
        subcategory,
        vendor,
        paymentMethod,
        project,
        receiptUrl,
        tags,
        isRecurring,
        recurringFrequency,
        startUp: startUpId,
        createdBy: req.user._id,
    });
    
    res.status(201).json(new ApiResponse(201, expense, 'Expense created successfully'));
});

export const createExpenseFromReceipt = asyncHandler(async (req, res) => {
    const { receiptData } = req.body;
    const { startUpId } = req.params;


    const serviceUrl = 'https://foundx.onrender.com';
    const parseResponse = await fetch(`${serviceUrl}/api/v1/bill-parser/parse-from-images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            images: [receiptData],
            bill_type: 'receipt',
            extract_text_only: false,
        }),
    });

    if (!parseResponse.ok) {
        throw new ApiError(500, 'Failed to parse receipt');
    }

    const parsedData = await parseResponse.json();
    const receiptInfo = parsedData[0]; 

    const expense = await Expense.create({
        title: receiptInfo.vendor_name || 'Receipt Expense',
        description: `Auto-generated from receipt - ${receiptInfo.bill_number || ''}`,
        amount: receiptInfo.total_amount || 0,
        category: 'Miscellaneous',
        vendor: {
            name: receiptInfo.vendor_name,
            contact: receiptInfo.vendor_contact,
            address: receiptInfo.vendor_address,
        },
        date: receiptInfo.bill_date ? new Date(receiptInfo.bill_date) : new Date(),
        receiptData: {
            confidence: receiptInfo.confidence,
            extractedText: receiptInfo.extracted_text,
            billType: receiptInfo.bill_type,
        },
        startUp: startUpId,
        createdBy: req.user._id,
    });

    res.status(201).json(new ApiResponse(201, expense, 'Expense created from receipt successfully'));
});

// Get all expenses
export const getExpenses = asyncHandler(async (req, res) => {
    const { startUpId } = req.params;
    const { category, startDate, endDate, page = 1, limit = 20, status, sortBy = 'date', sortOrder = 'desc' } = req.query;

    const filter = { startUp: startUpId };
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const expenses = await Expense.find(filter)
        .populate('createdBy', 'firstName lastName email')
        .populate('project', 'name')
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await Expense.countDocuments(filter);

    res.status(200).json(new ApiResponse(200, {
        expenses,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
        },
    }, 'Expenses retrieved successfully'));
});

export const getExpenseAnalytics = asyncHandler(async (req, res) => {
    const { startUpId } = req.params;
    const { period = 'monthly' } = req.query;

    const categoryAnalytics = await Expense.aggregate([
        { $match: { startUp: mongoose.Types.ObjectId(startUpId) } },
        {
            $group: {
                _id: '$category',
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 },
                averageAmount: { $avg: '$amount' },
            },
        },
        { $sort: { totalAmount: -1 } },
    ]);
    const monthlyTrend = await Expense.aggregate([
        { $match: { startUp: mongoose.Types.ObjectId(startUpId) } },
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                },
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 },
    ]);

    const recentExpenses = await Expense.find({ startUp: startUpId })
        .populate('createdBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(5);

    res.status(200).json(new ApiResponse(200, {
        categoryAnalytics,
        monthlyTrend,
        recentExpenses,
    }, 'Expense analytics retrieved successfully'));
});


export const createBudget = asyncHandler(async (req, res) => {
    const { name, description, totalAmount, period, startDate, endDate, categories, alertThreshold, project } = req.body;
    const { startUpId } = req.params;

    const budget = await Budget.create({
        name,
        description,
        totalAmount,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        categories,
        alertThreshold,
        project,
        startUp: startUpId,
        createdBy: req.user._id,
    });

    res.status(201).json(new ApiResponse(201, budget, 'Budget created successfully'));
});

export const getBudgets = asyncHandler(async (req, res) => {
    const { startUpId } = req.params;
    const { status, period } = req.query;

    const filter = { startUp: startUpId };
    if (status) filter.status = status;
    if (period) filter.period = period;

    const budgets = await Budget.find(filter)
        .populate('createdBy', 'firstName lastName')
        .populate('project', 'name')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, budgets, 'Budgets retrieved successfully'));
});

export const updateBudgetSpending = asyncHandler(async (req, res) => {
    const { budgetId } = req.params;
    const { category, amount } = req.body;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
        throw new ApiError(404, 'Budget not found');
    }

    const categoryIndex = budget.categories.findIndex(cat => cat.category === category);
    if (categoryIndex === -1) {
        throw new ApiError(404, 'Category not found in budget');
    }

    budget.categories[categoryIndex].spentAmount += amount;
    budget.categories[categoryIndex].remainingAmount = 
        budget.categories[categoryIndex].allocatedAmount - budget.categories[categoryIndex].spentAmount;

    const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spentAmount, 0);
    if (totalSpent > budget.totalAmount) {
        budget.status = 'Exceeded';
    }

    await budget.save();

    res.status(200).json(new ApiResponse(200, budget, 'Budget updated successfully'));
});

export const getBudgetVsActual = asyncHandler(async (req, res) => {
    const { startUpId } = req.params;
    const { budgetId } = req.query;

    let budgets;
    if (budgetId) {
        budgets = await Budget.find({ _id: budgetId, startUp: startUpId });
    } else {
        budgets = await Budget.find({ startUp: startUpId, status: 'Active' });
    }

    const reports = [];

    for (const budget of budgets) {
        const actualExpenses = await Expense.aggregate([
            {
                $match: {
                    startUp: mongoose.Types.ObjectId(startUpId),
                    date: {
                        $gte: budget.startDate,
                        $lte: budget.endDate,
                    },
                },
            },
            {
                $group: {
                    _id: '$category',
                    actualAmount: { $sum: '$amount' },
                },
            },
        ]);

        const comparison = budget.categories.map(budgetCat => {
            const actual = actualExpenses.find(exp => exp._id === budgetCat.category);
            const actualAmount = actual ? actual.actualAmount : 0;
            const variance = actualAmount - budgetCat.allocatedAmount;
            const variancePercentage = budgetCat.allocatedAmount > 0 ? 
                (variance / budgetCat.allocatedAmount) * 100 : 0;

            return {
                category: budgetCat.category,
                budgeted: budgetCat.allocatedAmount,
                actual: actualAmount,
                variance,
                variancePercentage,
                status: variance > 0 ? 'Over Budget' : 'Under Budget',
            };
        });

        reports.push({
            budget,
            comparison,
        });
    }

    res.status(200).json(new ApiResponse(200, reports, 'Budget vs actual report generated successfully'));
});


export const createFundingSource = asyncHandler(async (req, res) => {
    const { name, type, amount, currency, terms, investor, expectedDate } = req.body;
    const { startUpId } = req.params;

    const fundingSource = await FundingSource.create({
        name,
        type,
        amount,
        currency,
        terms,
        investor,
        expectedDate: expectedDate ? new Date(expectedDate) : undefined,
        startUp: startUpId,
        createdBy: req.user._id,
    });

    res.status(201).json(new ApiResponse(201, fundingSource, 'Funding source created successfully'));
});

export const getFundingSources = asyncHandler(async (req, res) => {
    const { startUpId } = req.params;
    const { type, status } = req.query;

    const filter = { startUp: startUpId };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const fundingSources = await FundingSource.find(filter)
        .populate('createdBy', 'firstName lastName')
        .sort({ createdAt: -1 });

    const summary = {
        totalCommitted: 0,
        totalReceived: 0,
        totalPending: 0,
        byType: {},
    };

    fundingSources.forEach(source => {
        if (source.status === 'Committed' || source.status === 'Received') {
            summary.totalCommitted += source.amount;
        }
        if (source.status === 'Received') {
            summary.totalReceived += source.receivedAmount;
        }
        if (source.status === 'Pending' || source.status === 'Committed') {
            summary.totalPending += (source.amount - source.receivedAmount);
        }

        if (!summary.byType[source.type]) {
            summary.byType[source.type] = { total: 0, count: 0 };
        }
        summary.byType[source.type].total += source.amount;
        summary.byType[source.type].count += 1;
    });

    res.status(200).json(new ApiResponse(200, {
        fundingSources,
        summary,
    }, 'Funding sources retrieved successfully'));
});


export const createFundraisingCampaign = asyncHandler(async (req, res) => {
    const { name, description, type, targetAmount, valuation, targetCloseDate, investors, milestones } = req.body;
    const { startUpId } = req.params;

    const campaign = await FundraisingCampaign.create({
        name,
        description,
        type,
        targetAmount,
        valuation,
        targetCloseDate: targetCloseDate ? new Date(targetCloseDate) : undefined,
        investors,
        milestones,
        startUp: startUpId,
        createdBy: req.user._id,
    });

    res.status(201).json(new ApiResponse(201, campaign, 'Fundraising campaign created successfully'));
});

export const getFundraisingCampaigns = asyncHandler(async (req, res) => {
    const { startUpId } = req.params;
    const { status } = req.query;

    const filter = { startUp: startUpId };
    if (status) filter.status = status;

    const campaigns = await FundraisingCampaign.find(filter)
        .populate('createdBy', 'firstName lastName')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, campaigns, 'Fundraising campaigns retrieved successfully'));
});

export const updateInvestorStatus = asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    const { investorIndex, status, commitedAmount, notes } = req.body;

    const campaign = await FundraisingCampaign.findById(campaignId);
    if (!campaign) {
        throw new ApiError(404, 'Campaign not found');
    }

    if (investorIndex >= 0 && investorIndex < campaign.investors.length) {
        campaign.investors[investorIndex].status = status;
        campaign.investors[investorIndex].lastContact = new Date();
        if (commitedAmount) campaign.investors[investorIndex].commitedAmount = commitedAmount;
        if (notes) campaign.investors[investorIndex].notes = notes;

        campaign.raisedAmount = campaign.investors.reduce((total, inv) => {
            return total + (inv.status === 'Committed' ? inv.commitedAmount || 0 : 0);
        }, 0);

        await campaign.save();
    }

    res.status(200).json(new ApiResponse(200, campaign, 'Investor status updated successfully'));
});


export const generateFinancialReport = asyncHandler(async (req, res) => {
    const { startUpId } = req.params;
    const { type, startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const expenses = await Expense.find({
        startUp: startUpId,
        date: { $gte: start, $lte: end },
        status: { $in: ['Approved', 'Reimbursed'] },
    });

    const funding = await FundingSource.find({
        startUp: startUpId,
        dateReceived: { $gte: start, $lte: end },
        status: 'Received',
    });

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = funding.reduce((sum, fund) => sum + fund.receivedAmount, 0);

    const categoryBreakdown = {};
    expenses.forEach(expense => {
        if (!categoryBreakdown[expense.category]) {
            categoryBreakdown[expense.category] = { spent: 0, count: 0 };
        }
        categoryBreakdown[expense.category].spent += expense.amount;
        categoryBreakdown[expense.category].count += 1;
    });

    const budgets = await Budget.find({
        startUp: startUpId,
        startDate: { $lte: end },
        endDate: { $gte: start },
    });

    const categoryBreakdownArray = Object.keys(categoryBreakdown).map(category => {
        const budget = budgets.find(b => b.categories.some(c => c.category === category));
        const budgetedAmount = budget ? 
            budget.categories.find(c => c.category === category)?.allocatedAmount || 0 : 0;
        
        return {
            category,
            spent: categoryBreakdown[category].spent,
            budgeted: budgetedAmount,
            variance: categoryBreakdown[category].spent - budgetedAmount,
            percentage: totalExpenses > 0 ? (categoryBreakdown[category].spent / totalExpenses) * 100 : 0,
        };
    });

    const insights = [];
    
    if (totalExpenses > totalIncome) {
        insights.push({
            type: 'Cash Flow',
            message: `Expenses exceed income by $${(totalExpenses - totalIncome).toFixed(2)}`,
            severity: 'Warning',
        });
    }

    categoryBreakdownArray.forEach(cat => {
        if (cat.budgeted > 0 && cat.variance > 0) {
            insights.push({
                type: 'Budget Variance',
                message: `${cat.category} is over budget by $${cat.variance.toFixed(2)}`,
                severity: cat.variance > cat.budgeted * 0.2 ? 'Critical' : 'Warning',
            });
        }
    });

    const report = await FinancialReport.create({
        title: `${type} Financial Report`,
        type,
        period: { startDate: start, endDate: end },
        summary: {
            totalIncome,
            totalExpenses,
            netCashFlow: totalIncome - totalExpenses,
            budgetUtilization: budgets.length > 0 ? (totalExpenses / budgets.reduce((sum, b) => sum + b.totalAmount, 0)) * 100 : 0,
        },
        categoryBreakdown: categoryBreakdownArray,
        insights,
        startUp: startUpId,
        generatedBy: req.user._id,
    });

    res.status(201).json(new ApiResponse(201, report, 'Financial report generated successfully'));
});

export const getFinancialReports = asyncHandler(async (req, res) => {
    const { startUpId } = req.params;
    const { type } = req.query;

    const filter = { startUp: startUpId };
    if (type) filter.type = type;

    const reports = await FinancialReport.find(filter)
        .populate('generatedBy', 'firstName lastName')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, reports, 'Financial reports retrieved successfully'));
});

export const getDashboardData = asyncHandler(async (req, res) => {
    const { startUpId } = req.params;

    const currentMonth = new Date();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    
    const monthlyExpenses = await Expense.find({
        startUp: startUpId,
        date: { $gte: firstDayOfMonth },
    });

    const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const activeBudgets = await Budget.find({
        startUp: startUpId,
        status: 'Active',
    });

    const fundingSources = await FundingSource.find({ startUp: startUpId });
    const totalFunding = fundingSources.reduce((sum, fund) => sum + fund.receivedAmount, 0);

    const recentTransactions = await Expense.find({ startUp: startUpId })
        .populate('createdBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(10);

    const budgetAlerts = [];
    activeBudgets.forEach(budget => {
        budget.categories.forEach(category => {
            const utilizationRate = (category.spentAmount / category.allocatedAmount) * 100;
            if (utilizationRate >= budget.alertThreshold) {
                budgetAlerts.push({
                    budgetName: budget.name,
                    category: category.category,
                    utilizationRate,
                    severity: utilizationRate >= 100 ? 'Critical' : 'Warning',
                });
            }
        });
    });

    res.status(200).json(new ApiResponse(200, {
        monthlyExpenses: {
            total: monthlyTotal,
            count: monthlyExpenses.length,
            transactions: monthlyExpenses.slice(0, 5),
        },
        activeBudgets: activeBudgets.length,
        totalFunding,
        recentTransactions,
        budgetAlerts,
    }, 'Dashboard data retrieved successfully'));
});
