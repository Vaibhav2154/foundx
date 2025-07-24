import multer from 'multer';
const upload = multer();
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

router.post('/startup/:startUpId/expenses/from-receipt-file', upload.single('file'), createExpenseFromReceiptFile);
router.route('/startup/:startUpId/expenses')
    .post(createExpense)
    .get(getExpenses);
router.post('/startup/:startUpId/expenses/from-receipt', createExpenseFromReceipt);
router.get('/startup/:startUpId/expenses/analytics', getExpenseAnalytics);

router.route('/startup/:startUpId/budgets')
    .post(createBudget)
    .get(getBudgets);

router.put('/budget/:budgetId/spending', updateBudgetSpending);
router.get('/startup/:startUpId/budget-vs-actual', getBudgetVsActual);

router.route('/startup/:startUpId/funding-sources')
    .post(createFundingSource)
    .get(getFundingSources);

router.route('/startup/:startUpId/fundraising-campaigns')
    .post(createFundraisingCampaign)
    .get(getFundraisingCampaigns);

router.put('/fundraising-campaign/:campaignId/investor', updateInvestorStatus);

router.route('/startup/:startUpId/financial-reports')
    .post(generateFinancialReport)
    .get(getFinancialReports);

router.get('/startup/:startUpId/dashboard', getDashboardData);

export default router;
