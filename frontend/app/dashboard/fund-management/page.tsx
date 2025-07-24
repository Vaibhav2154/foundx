'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStartUp } from '@/api/startup';
import FundManagementDashboard from '@/components/fund-management/FundManagementDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { showError } from '@/utils/toast';

export default function FundManagementPage() {
  const { user, getUserData } = useAuth();
  const [startUpData, setStartUpData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStartUpData();
  }, []);

  const fetchStartUpData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = user || getUserData();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const response = await getStartUp();
      console.log('Startup API response:', response);
      
      if (response.success && response.data && response.data.length > 0) {
        const startup = response.data[0];
        setStartUpData(startup);
      } else {
        throw new Error('No startup found for current user');
      }
    } catch (error: any) {
      console.error('Error fetching startup data:', error);
      setError(error.message || 'Failed to load startup data');
      showError('Failed to load startup data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading fund management...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !startUpData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
        <div className="flex items-center justify-center min-h-96">
          <Card className="p-8 text-center max-w-md mx-auto">
            <div className="text-red-400 mb-4">
              <AlertCircle className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">Unable to Load Fund Management</h3>
            <p className="text-gray-400 mb-4">{error || 'No startup data available'}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={fetchStartUpData} icon={<RefreshCw size={18} />}>
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      <div className="max-w-[95%] 2xl:max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        <FundManagementDashboard startUpId={startUpData._id} startUpData={startUpData} />
      </div>
    </div>
  );
}
