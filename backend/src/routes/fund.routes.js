import multer from 'multer';
const upload = multer();
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { Router } from 'express';
import {
    createExpense,
    createExpenseFromReceipt,
    getExpenses,
    getExpenseAnalytics,
    
    createBudget,
    getBudgets,
    updateBudgetSpending,
    getBudgetVsActual,
    
    createFundingSource,
    getFundingSources,
    
    createFundraisingCampaign,
    getFundraisingCampaigns,
    updateInvestorStatus,
    
    generateFinancialReport,
    getFinancialReports,
    
    getDashboardData,
} from '../controllers/fund.controller.js';

const router = Router();


// Expense routes (protected)
router.route('/startup/:startUpId/expenses')
    .post(authMiddleware, createExpense)
    .get(authMiddleware, getExpenses);
import { createExpenseFromReceiptFile } from '../controllers/fund.controller.js';
router.post('/startup/:startUpId/expenses/from-receipt-file', authMiddleware, upload.single('file'), createExpenseFromReceiptFile);
router.post('/startup/:startUpId/expenses/from-receipt', authMiddleware, createExpenseFromReceipt);
router.get('/startup/:startUpId/expenses/analytics', authMiddleware, getExpenseAnalytics);

router.route('/startup/:startUpId/budgets')
    .post(authMiddleware, createBudget)
    .get(authMiddleware, getBudgets);

router.put('/budget/:budgetId/spending', authMiddleware, updateBudgetSpending);
router.get('/startup/:startUpId/budget-vs-actual', authMiddleware, getBudgetVsActual);

router.route('/startup/:startUpId/funding-sources')
    .post(authMiddleware, createFundingSource)
    .get(authMiddleware, getFundingSources);

router.route('/startup/:startUpId/fundraising-campaigns')
    .post(authMiddleware, createFundraisingCampaign)
    .get(authMiddleware, getFundraisingCampaigns);

router.put('/fundraising-campaign/:campaignId/investor', authMiddleware, updateInvestorStatus);

router.route('/startup/:startUpId/financial-reports')
    .post(authMiddleware, generateFinancialReport)
    .get(authMiddleware, getFinancialReports);

router.get('/startup/:startUpId/dashboard', authMiddleware, getDashboardData);

export default router;
