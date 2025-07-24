import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        enum: [
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
        ],
    },
    subcategory: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Bank Transfer', 'Check', 'Digital Payment', 'Other'],
        default: 'Other',
    },
    vendor: {
        name: String,
        contact: String,
        address: String,
    },
    receiptUrl: {
        type: String,
    },
    receiptData: {
        confidence: Number,
        extractedText: String,
        billType: String,
    },
    tags: [String],
    isRecurring: {
        type: Boolean,
        default: false,
    },
    recurringFrequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'],
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    startUp: {
        type: Schema.Types.ObjectId,
        ref: 'StartUp',
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Reimbursed'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});

const budgetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    period: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Yearly', 'Project-based'],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    categories: [{
        category: {
            type: String,
            required: true,
        },
        allocatedAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        spentAmount: {
            type: Number,
            default: 0,
        },
        remainingAmount: {
            type: Number,
            default: function () {
                return this.allocatedAmount - this.spentAmount;
            },
        },
    }],
    alertThreshold: {
        type: Number,
        default: 80,
        min: 0,
        max: 100,
    },
    status: {
        type: String,
        enum: ['Active', 'Paused', 'Completed', 'Exceeded'],
        default: 'Active',
    },
    startUp: {
        type: Schema.Types.ObjectId,
        ref: 'StartUp',
        required: true,
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

const fundingSourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: [
            'Bootstrapping',
            'Friends & Family',
            'Angel Investment',
            'Venture Capital',
            'Crowdfunding',
            'Government Grant',
            'Bank Loan',
            'Revenue',
            'Other'
        ],
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        default: 'USD',
    },
    receivedAmount: {
        type: Number,
        default: 0,
    },
    remainingAmount: {
        type: Number,
        default: function () {
            return this.amount - this.receivedAmount;
        },
    },
    dateReceived: {
        type: Date,
    },
    expectedDate: {
        type: Date,
    },
    terms: {
        equityPercentage: Number,
        valuationCap: Number,
        interestRate: Number,
        paybackPeriod: Number,
        conditions: [String],
    },
    investor: {
        name: String,
        contact: String,
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Committed', 'Received', 'Rejected', 'Cancelled'],
        default: 'Pending',
    },
    documents: [{
        type: String,
        description: String,
        url: String,
    }],
    startUp: {
        type: Schema.Types.ObjectId,
        ref: 'StartUp',
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});


const financialReportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Yearly', 'Custom'],
        required: true,
    },
    period: {
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    summary: {
        totalIncome: {
            type: Number,
            default: 0,
        },
        totalExpenses: {
            type: Number,
            default: 0,
        },
        netCashFlow: {
            type: Number,
            default: function () {
                return this.totalIncome - this.totalExpenses;
            },
        },
        budgetUtilization: {
            type: Number,
            default: 0,
        },
    },
    categoryBreakdown: [{
        category: String,
        budgeted: Number,
        spent: Number,
        variance: Number,
        percentage: Number,
    }],
    insights: [{
        type: String,
        message: String,
        severity: {
            type: String,
            enum: ['Info', 'Warning', 'Critical'],
            default: 'Info',
        },
    }],
    startUp: {
        type: Schema.Types.ObjectId,
        ref: 'StartUp',
        required: true,
    },
    generatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

const fundraisingCampaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['Seed', 'Series A', 'Series B', 'Series C', 'Bridge', 'Crowdfunding', 'Grant'],
    },
    targetAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    raisedAmount: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        default: 'USD',
    },
    valuation: {
        pre: Number,
        post: Number,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    targetCloseDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Planning', 'Active', 'Paused', 'Closed', 'Failed'],
        default: 'Planning',
    },
    investors: [{
        name: String,
        type: String,
        contactInfo: String,
        commitedAmount: Number,
        status: {
            type: String,
            enum: ['Interested', 'Due Diligence', 'Committed', 'Declined'],
        },
        lastContact: Date,
        notes: String,
    }],
    milestones: [{
        name: String,
        description: String,
        targetDate: Date,
        completed: {
            type: Boolean,
            default: false,
        },
        completedDate: Date,
    }],
    documents: [{
        type: String,
        name: String,
        url: String,
        version: String,
    }],
    metrics: {
        conversionRate: Number,
        averageInvestmentSize: Number,
        timeToClose: Number,
    },
    startUp: {
        type: Schema.Types.ObjectId,
        ref: 'StartUp',
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});


expenseSchema.index({ startUp: 1, date: -1 });
expenseSchema.index({ category: 1, startUp: 1 });
budgetSchema.index({ startUp: 1, status: 1 });
fundingSourceSchema.index({ startUp: 1, status: 1 });
fundraisingCampaignSchema.index({ startUp: 1, status: 1 });


export const Expense = mongoose.model('Expense', expenseSchema);
export const Budget = mongoose.model('Budget', budgetSchema);
export const FundingSource = mongoose.model('FundingSource', fundingSourceSchema);
export const FinancialReport = mongoose.model('FinancialReport', financialReportSchema);
export const FundraisingCampaign = mongoose.model('FundraisingCampaign', fundraisingCampaignSchema);
