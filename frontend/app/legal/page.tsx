"use client";

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Edit3, 
  Clock,
  CheckCircle,
  Filter,
  Search,
  HelpCircle,
  Loader2,
  AlertCircle,
  Plus,
  Sparkles,
  Shield} from 'lucide-react';
import apiService from '@/config/apiservice';

const LegalDocuments = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<any>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<any>({});

  const templates = [
    {
      id: 'nda',
      title: 'Non-Disclosure Agreement',
      description: 'Protect confidential information shared with partners, employees, or contractors',
      category: 'Confidentiality',
      estimatedTime: '5 min'
    },
    {
      id: 'founder-agreement',
      title: 'Founder Agreement',
      description: 'Define roles, equity distribution, and responsibilities between co-founders',
      category: 'Equity',
      estimatedTime: '15 min'
    },
    {
      id: 'employment-contract',
      title: 'Employment Contract',
      description: 'Hire employees with clear terms, compensation, and expectations',
      category: 'Employment',
      estimatedTime: '10 min'
    },
    {
      id: 'consultant-agreement',
      title: 'Consultant Agreement',
      description: 'Engage freelancers and contractors with defined scope and deliverables',
      category: 'Contracts',
      estimatedTime: '8 min'
    },
    {
      id: 'terms-of-service',
      title: 'Terms of Service',
      description: 'Legal terms for users of your product or service',
      category: 'Legal',
      estimatedTime: '12 min'
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      description: 'Compliance document for data collection and user privacy',
      category: 'Legal',
      estimatedTime: '10 min'
    }
  ];

  const recentDocuments = [
    { title: 'NDA - Acme Corp Partnership', status: 'completed', date: '2 hours ago', type: 'NDA' },
    { title: 'Employment Contract - Sarah Wilson', status: 'draft', date: '1 day ago', type: 'Employment' },
    { title: 'Founder Agreement - Version 2', status: 'completed', date: '3 days ago', type: 'Equity' },
    { title: 'Consultant Agreement - Marketing', status: 'completed', date: '1 week ago', type: 'Contract' }
  ];

  const renderFormFields = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    
    switch (selectedTemplate) {
      case 'nda':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Disclosing Party (Your Company)
                </label>
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => handleFormChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Receiving Party
                </label>
                <input
                  type="text"
                  value={formData.receivingParty || ''}
                  onChange={(e) => handleFormChange('receivingParty', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Partner/Employee Name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Purpose of Disclosure
              </label>
              <textarea
                rows={3}
                value={formData.purpose || ''}
                onChange={(e) => handleFormChange('purpose', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                placeholder="Describe why you're sharing confidential information..."
              />
            </div>
          </>
        );
      
      case 'founder-agreement':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => handleFormChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Vesting Schedule
                </label>
                <select 
                  value={formData.vestingSchedule || '4 years'}
                  onChange={(e) => handleFormChange('vestingSchedule', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                >
                  <option value="4 years">4 years</option>
                  <option value="3 years">3 years</option>
                  <option value="5 years">5 years</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Founders Information
              </label>
              <textarea
                rows={3}
                value={formData.founders || ''}
                onChange={(e) => handleFormChange('founders', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                placeholder="List founder names and basic info..."
              />
            </div>
          </>
        );
      
      case 'employment-contract':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => handleFormChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Employee Name
                </label>
                <input
                  type="text"
                  value={formData.employeeName || ''}
                  onChange={(e) => handleFormChange('employeeName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Employee Full Name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.position || ''}
                  onChange={(e) => handleFormChange('position', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Job Title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Salary
                </label>
                <input
                  type="text"
                  value={formData.salary || ''}
                  onChange={(e) => handleFormChange('salary', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Annual Salary"
                />
              </div>
            </div>
          </>
        );
      
      case 'consultant-agreement':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => handleFormChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Consultant Name
                </label>
                <input
                  type="text"
                  value={formData.consultantName || ''}
                  onChange={(e) => handleFormChange('consultantName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Consultant Full Name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Scope of Work
              </label>
              <textarea
                rows={3}
                value={formData.scopeOfWork || ''}
                onChange={(e) => handleFormChange('scopeOfWork', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                placeholder="Describe the work to be performed..."
              />
            </div>
          </>
        );
      
      case 'terms-of-service':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => handleFormChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl || ''}
                  onChange={(e) => handleFormChange('websiteUrl', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail || ''}
                  onChange={(e) => handleFormChange('contactEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="contact@yourcompany.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Effective Date
                </label>
                <input
                  type="date"
                  value={formData.effectiveDate || ''}
                  onChange={(e) => handleFormChange('effectiveDate', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Service Description
              </label>
              <textarea
                rows={3}
                value={formData.serviceDescription || ''}
                onChange={(e) => handleFormChange('serviceDescription', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                placeholder="Describe your service or product..."
              />
            </div>
          </>
        );
      
      case 'privacy-policy':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => handleFormChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl || ''}
                  onChange={(e) => handleFormChange('websiteUrl', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail || ''}
                  onChange={(e) => handleFormChange('contactEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="privacy@yourcompany.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Effective Date
                </label>
                <input
                  type="date"
                  value={formData.effectiveDate || ''}
                  onChange={(e) => handleFormChange('effectiveDate', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Data Collection Practices
              </label>
              <textarea
                rows={3}
                value={formData.dataCollection || ''}
                onChange={(e) => handleFormChange('dataCollection', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                placeholder="Describe what data you collect from users..."
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  const renderHelpContent = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return null;

    const helpContent = {
      'nda': {
        title: 'Understanding NDAs',
        sections: [
          {
            title: 'What is an NDA?',
            content: 'A legal contract that prevents the sharing of confidential business information.'
          },
          {
            title: 'When to use it?',
            content: 'Before sharing business plans, financial data, or proprietary information with partners, employees, or investors.'
          },
          {
            title: 'Key clauses:',
            content: ['Definition of confidential information', 'Duration of confidentiality', 'Permitted disclosures', 'Return of information']
          }
        ]
      },
      'founder-agreement': {
        title: 'Understanding Founder Agreements',
        sections: [
          {
            title: 'What is a Founder Agreement?',
            content: 'A legal contract that defines the relationship, roles, and equity distribution among company co-founders.'
          },
          {
            title: 'When to use it?',
            content: 'At the very beginning of your startup journey, before any significant business activities begin.'
          },
          {
            title: 'Key clauses:',
            content: ['Equity distribution', 'Roles and responsibilities', 'Vesting schedules', 'Decision-making process']
          }
        ]
      },
      'employment-contract': {
        title: 'Understanding Employment Contracts',
        sections: [
          {
            title: 'What is an Employment Contract?',
            content: 'A legal agreement that outlines the terms and conditions of employment between employer and employee.'
          },
          {
            title: 'When to use it?',
            content: 'When hiring new employees to clearly define expectations, compensation, and obligations.'
          },
          {
            title: 'Key clauses:',
            content: ['Job description and duties', 'Compensation and benefits', 'Working hours and location', 'Termination conditions']
          }
        ]
      },
      'consultant-agreement': {
        title: 'Understanding Consultant Agreements',
        sections: [
          {
            title: 'What is a Consultant Agreement?',
            content: 'A contract that defines the scope of work, payment terms, and obligations for freelance or consulting services.'
          },
          {
            title: 'When to use it?',
            content: 'When engaging independent contractors or consultants for specific projects or ongoing services.'
          },
          {
            title: 'Key clauses:',
            content: ['Scope of work', 'Payment terms and schedule', 'Intellectual property ownership', 'Confidentiality provisions']
          }
        ]
      },
      'terms-of-service': {
        title: 'Understanding Terms of Service',
        sections: [
          {
            title: 'What are Terms of Service?',
            content: 'Legal agreements that users must accept to use your website, app, or service.'
          },
          {
            title: 'When to use it?',
            content: 'For any digital product or service to protect your business and set clear user expectations.'
          },
          {
            title: 'Key clauses:',
            content: ['User obligations and prohibited uses', 'Limitation of liability', 'Intellectual property rights', 'Termination conditions']
          }
        ]
      },
      'privacy-policy': {
        title: 'Understanding Privacy Policies',
        sections: [
          {
            title: 'What is a Privacy Policy?',
            content: 'A legal document that explains how you collect, use, store, and protect user data.'
          },
          {
            title: 'When to use it?',
            content: 'Required by law in most jurisdictions when collecting any personal data from users.'
          },
          {
            title: 'Key clauses:',
            content: ['Data collection practices', 'Data usage and sharing', 'User rights and controls', 'Security measures']
          }
        ]
      }
    };

    const content = helpContent[selectedTemplate as keyof typeof helpContent];
    if (!content) return null;

    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <HelpCircle className="h-4 w-4 text-white" />
          </div>
          {content.title}
        </h3>
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          {content.sections.map((section, index) => (
            <div key={index} className="p-4 bg-white/50 dark:bg-slate-800/30 rounded-xl border border-white/30 dark:border-slate-700/30">
              <p className="font-medium text-slate-900 dark:text-slate-100 mb-2">{section.title}</p>
              {Array.isArray(section.content) ? (
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{section.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const generateDocument = async () => {
    if (!selectedTemplate || !formData) return;

    setIsGenerating(true);
    setError('');

    try {
      let response: Blob;
      let filename: string;
      
      switch (selectedTemplate) {
        case 'nda':
          response = await apiService.createNDA({
            parties_info: {
              company_name: formData.companyName || '',
              company_address: formData.companyAddress || '',
              other_party_name: formData.receivingParty || '',
              other_party_address: formData.receivingPartyAddress || '',
              purpose: formData.purpose || '',
              duration: formData.duration || '2',
              governing_law: formData.governingLaw || 'india'
            },
            use_ai: true
          });
          filename = `nda_${formData.companyName || 'document'}.pdf`;
          break;
        
        case 'founder-agreement':
          response = await apiService.createFounderAgreement({
            founders_info: {
              company_name: formData.companyName || '',
              founders: formData.founders || [],
              equity_distribution: formData.equityDistribution || {},
              vesting_schedule: formData.vestingSchedule || '4 years',
              roles_responsibilities: formData.rolesResponsibilities || {},
              governing_law: formData.governingLaw || 'india'
            },
            use_ai: true
          });
          filename = `founder_agreement_${formData.companyName || 'document'}.pdf`;
          break;
        
        case 'employment-contract':
          response = await apiService.createEmploymentContract({
            employment_info: {
              company_name: formData.companyName || '',
              employee_name: formData.employeeName || '',
              position: formData.position || '',
              salary: formData.salary || '',
              start_date: formData.startDate || '',
              employment_type: formData.employmentType || 'full-time',
              benefits: formData.benefits || [],
              governing_law: formData.governingLaw || 'india'
            },
            use_ai: true
          });
          filename = `employment_contract_${formData.employeeName || 'document'}.pdf`;
          break;
        
        case 'consultant-agreement':
          response = await apiService.createCDA({
            parties_info: {
              company_name: formData.companyName || '',
              consultant_name: formData.consultantName || '',
              scope_of_work: formData.scopeOfWork || '',
              payment_terms: formData.paymentTerms || '',
              duration: formData.duration || '',
              governing_law: formData.governingLaw || 'india'
            },
            use_ai: true
          });
          filename = `consultant_agreement_${formData.consultantName || 'document'}.pdf`;
          break;
        
        case 'terms-of-service':
          response = await apiService.createTermsOfService({
            company_info: {
              company_name: formData.companyName || '',
              website_url: formData.websiteUrl || '',
              contact_email: formData.contactEmail || '',
              service_description: formData.serviceDescription || '',
              governing_law: formData.governingLaw || 'india',
              effective_date: formData.effectiveDate || new Date().toISOString().split('T')[0]
            },
            use_ai: true
          });
          filename = `terms_of_service_${formData.companyName || 'document'}.pdf`;
          break;
        
        case 'privacy-policy':
          response = await apiService.createPrivacyPolicy({
            company_info: {
              company_name: formData.companyName || '',
              website_url: formData.websiteUrl || '',
              contact_email: formData.contactEmail || '',
              data_collection: formData.dataCollection || '',
              data_usage: formData.dataUsage || '',
              data_sharing: formData.dataSharing || '',
              governing_law: formData.governingLaw || 'india',
              effective_date: formData.effectiveDate || new Date().toISOString().split('T')[0]
            },
            use_ai: true
          });
          filename = `privacy_policy_${formData.companyName || 'document'}.pdf`;
          break;
        
        default:
          throw new Error('Unsupported document type');
      }

      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setGeneratedDocument({
        filename: filename,
        file_type: 'application/pdf',
        status: 'success',
        ai_generated: true
      });
      setShowGenerator(false);
      
      setError('');
      console.log(`Document generated successfully: ${filename}`);
    } catch (error) {
      console.error('Error generating document:', error);
      setError('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadDocument = async (filename: string) => {
    try {
      const blob = await apiService.downloadDocument(filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
      setError('Failed to download document. Please try again.');
    }
  };

  const startNewDocument = (templateId: string) => {
    setSelectedTemplate(templateId);
    setFormData({});
    setGeneratedDocument(null);
    setError('');
    setShowGenerator(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Legal Documents
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate legally sound documents with AI-powered insights and plain-language explanations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30 rounded-xl p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">12</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Documents Generated</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 backdrop-blur-sm border border-green-200/30 dark:border-green-700/30 rounded-xl p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">8</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Completed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 backdrop-blur-sm border border-orange-200/30 dark:border-orange-700/30 rounded-xl p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center mr-3">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">4</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">In Progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showGenerator ? (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center text-red-700 dark:text-red-300 backdrop-blur-sm">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            )}

            {generatedDocument && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center justify-between backdrop-blur-sm">
                <div className="flex items-center text-green-700 dark:text-green-300">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Document generated successfully: {generatedDocument.filename}</span>
                </div>
                <button
                  onClick={() => downloadDocument(generatedDocument.filename)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Generate NDA
              </h2>
              <button
                onClick={() => setShowGenerator(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <span>← Back to Templates</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <form className="space-y-6">
                  {renderFormFields()}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Duration (Years)
                      </label>
                      <select 
                        value={formData.duration || '2'}
                        onChange={(e) => handleFormChange('duration', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                      >
                        <option value="2">2 years</option>
                        <option value="3">3 years</option>
                        <option value="5">5 years</option>
                        <option value="indefinite">Indefinite</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Governing Law
                      </label>
                      <select 
                        value={formData.governingLaw || 'india'}
                        onChange={(e) => handleFormChange('governingLaw', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200"
                      >
                        <option value="india">India</option>
                        <option value="us">United States</option>
                        <option value="uk">United Kingdom</option>
                        <option value="singapore">Singapore</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <input
                      type="checkbox"
                      id="return-clause"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <label htmlFor="return-clause" className="text-sm text-slate-700 dark:text-slate-300">
                      Include return of information clause
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        generateDocument();
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 mr-3" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="h-5 w-5 mr-2" />
                          Generate Document
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      Save as Draft
                    </button>
                  </div>

                  {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      {error}
                    </div>
                  )}
                </form>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                {renderHelpContent()}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search document templates..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-slate-800/50 backdrop-blur-md transition-all duration-200"
                />
              </div>
              <button className="flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md">
                <Filter className="h-5 w-5 mr-2" />
                Filter
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Document Templates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105 card-hover">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-3 shadow-lg">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                        {template.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{template.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {template.estimatedTime}
                      </span>
                      <button
                        onClick={() => startNewDocument(template.id)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Recent Documents
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-slate-100">Document</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-slate-100">Type</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-slate-100">Status</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-slate-100">Date</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-slate-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDocuments.map((doc, index) => (
                      <tr key={index} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-medium text-slate-900 dark:text-slate-100">{doc.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{doc.type}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            doc.status === 'completed' 
                              ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 text-green-800 dark:text-green-300' 
                              : 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 text-yellow-800 dark:text-yellow-300'
                          }`}>
                            {doc.status === 'completed' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{doc.date}</td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        
        {!showGenerator && (
          <div className="fixed bottom-8 right-8 z-50">
            <button
              onClick={() => setShowQuickSelect(true)}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center space-x-2"
              title="Quick Generate Document"
            >
              <Plus className="h-6 w-6" />
              <span className="hidden group-hover:block text-sm font-medium pr-2 animate-pulse">Quick Generate</span>
            </button>
          </div>
        )}
        
        {showQuickSelect && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Quick Generate Document
                  </h3>
                  <button
                    onClick={() => setShowQuickSelect(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        startNewDocument(template.id);
                        setShowQuickSelect(false);
                      }}
                      className="text-left p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 group"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{template.title}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full">
                          {template.category}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {template.estimatedTime}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalDocuments;