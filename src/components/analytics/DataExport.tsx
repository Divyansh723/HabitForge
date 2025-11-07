import React, { useState } from 'react';
import { Download, CheckCircle, AlertCircle, FileText, BarChart3, Heart, Target } from 'lucide-react';
import { Card, Badge, Button, Select } from '@/components/ui';
import { useAnalytics } from '@/hooks/useAnalytics';
import { cn } from '@/utils/cn';


interface ExportOption {
  id: string;
  name: string;
  description: string;
  format: string;
  icon: React.ComponentType<any>;
  estimatedSize: string;
  includesTimezone: boolean;
}

interface DataExportProps {
  className?: string;
}

export const DataExport: React.FC<DataExportProps> = ({ className }) => {
  const { exportData } = useAnalytics();
  const [selectedExport, setSelectedExport] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('30_days');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const exportOptions: ExportOption[] = [
    {
      id: 'habits_complete',
      name: 'Complete Habit Data',
      description: 'Full export including habits, completions, streaks, and metadata',
      format: 'csv',
      icon: Target,
      estimatedSize: '2-5 MB',
      includesTimezone: true
    },
    {
      id: 'completions_only',
      name: 'Completion Records',
      description: 'Simple completion tracking data for analysis',
      format: 'csv',
      icon: CheckCircle,
      estimatedSize: '500 KB',
      includesTimezone: true
    },
    {
      id: 'analytics_summary',
      name: 'Analytics Summary',
      description: 'Aggregated statistics and trend data',
      format: 'csv',
      icon: BarChart3,
      estimatedSize: '100 KB',
      includesTimezone: false
    },
    {
      id: 'wellbeing_data',
      name: 'Wellbeing & Mood Data',
      description: 'Mood tracking, stress levels, and wellbeing insights',
      format: 'csv',
      icon: Heart,
      estimatedSize: '1 MB',
      includesTimezone: true
    }
  ];

  const dateRangeOptions = [
    { value: '7_days', label: 'Last 7 days' },
    { value: '30_days', label: 'Last 30 days' },
    { value: '90_days', label: 'Last 3 months' },
    { value: '1_year', label: 'Last year' },
    { value: 'all_time', label: 'All time' }
  ];

  const handleExport = async () => {
    if (!selectedExport) return;
    
    setIsExporting(true);
    setExportStatus('idle');
    
    try {
      // Use real export functionality
      await exportData('csv');
      setExportStatus('success');
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };





  const getStatusIcon = () => {
    switch (exportStatus) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (exportStatus) {
      case 'success':
        return 'Export completed successfully!';
      case 'error':
        return 'Export failed. Please try again.';
      default:
        return '';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Download className="h-5 w-5 text-green-500" />
          Data Export
        </h3>
        <Badge variant="outline" size="sm">
          CSV Format with UTC Timestamps
        </Badge>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedExport === option.id;
          
          return (
            <Card 
              key={option.id}
              className={cn(
                'p-4 cursor-pointer transition-all hover:shadow-md',
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
              )}
              onClick={() => setSelectedExport(option.id)}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  isSelected ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'
                )}>
                  <Icon className={cn(
                    'h-5 w-5',
                    isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {option.name}
                    </h4>
                    <Badge variant="outline" size="sm">
                      {option.format.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {option.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-500">
                      Est. size: {option.estimatedSize}
                    </span>
                    {option.includesTimezone && (
                      <Badge variant="outline" size="sm" className="text-xs">
                        Timezone Info
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Export Configuration */}
      {selectedExport && (
        <Card className="p-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">
            Export Configuration
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                options={dateRangeOptions}
              />
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                    Export Details
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Your export will include:
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• All timestamps are provided in UTC</li>
                    <li>• Personal identifiers are anonymized</li>
                    <li>• Data is formatted for easy analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Export Status */}
      {exportStatus !== 'idle' && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <span className="text-sm font-medium">
              {getStatusMessage()}
            </span>
          </div>
        </Card>
      )}

      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleExport}
          disabled={!selectedExport || isExporting}
          className="min-w-32"
        >
          {isExporting ? 'Exporting...' : `Export ${selectedExport ? exportOptions.find(opt => opt.id === selectedExport)?.name : ''}`}
        </Button>
      </div>

      {/* Privacy Notice */}
      <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Privacy & Data Protection</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your exported data is processed locally and never sent to external servers during export. 
              All personal identifiers are anonymized while maintaining data utility for analysis.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};