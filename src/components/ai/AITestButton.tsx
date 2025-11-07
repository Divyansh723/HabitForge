import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { aiService } from '@/services/aiService';

export const AITestButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testAI = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      // First check AI status
      const statusResponse = await fetch('/api/ai/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('habitforge-auth') ? JSON.parse(localStorage.getItem('habitforge-auth')!).state?.token : ''}`
        }
      });
      
      let modelInfo = 'Unknown Model';
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log('AI Status:', statusData.data);
        
        if (!statusData.data.isAvailable) {
          setError(`AI not available. Model: ${statusData.data.currentModel || 'None'}, API Key: ${statusData.data.hasApiKey ? 'Set' : 'Missing'}`);
          return;
        }
        
        modelInfo = statusData.data.currentModelTier || statusData.data.currentModel || 'Unknown';
      }

      // Test actual AI functionality
      const insights = await aiService.getHabitInsights();
      setResult(`✅ AI working! ${modelInfo}, Score: ${insights.overallProgress.score}`);
    } catch (err) {
      console.error('AI Test Error:', err);
      setError(err instanceof Error ? err.message : 'AI test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={testAI}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Brain className="h-4 w-4" />
        {isLoading ? 'Testing AI...' : 'Test AI'}
      </Button>
      
      {result && (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">{result}</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-1 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};