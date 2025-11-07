import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface TrendGraphProps {
  data: DataPoint[];
  title: string;
  subtitle?: string;
  color?: string;
  height?: number;
  showTrend?: boolean;
  showGrid?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
}

export const TrendGraph: React.FC<TrendGraphProps> = ({
  data,
  title,
  subtitle,
  color = '#3B82F6',
  height = 200,
  showTrend = true,
  showGrid = true,
  valueFormatter = (value) => `${value}%`,
  className,
}) => {
  if (data.length === 0) {
    return (
      <Card className={cn('flex items-center justify-center', className)} style={{ height }}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📊</div>
          <p>No data available</p>
        </div>
      </Card>
    );
  }

  // Calculate dimensions and scales
  const padding = 40;
  const width = 400; // Will be responsive via CSS
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);

  const minValue = Math.min(...data.map(d => d.value));
  const maxValue = Math.max(...data.map(d => d.value));
  const valueRange = maxValue - minValue || 1;

  // Create SVG path for the line
  const createPath = (points: DataPoint[]) => {
    return points
      .map((point, index) => {
        const x = padding + (index / (points.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  // Create area path for gradient fill
  const createAreaPath = (points: DataPoint[]) => {
    const linePath = createPath(points);
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    
    const lastX = padding + ((points.length - 1) / (points.length - 1)) * chartWidth;
    const firstX = padding;
    const bottomY = padding + chartHeight;
    
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) return { direction: 'neutral', percentage: 0 };
    
    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    const change = lastValue - firstValue;
    const percentage = firstValue !== 0 ? Math.abs((change / firstValue) * 100) : 0;
    
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      percentage: Math.round(percentage * 10) / 10,
    };
  };

  const trend = calculateTrend();

  const getTrendIcon = () => {
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend.direction) {
      case 'up':
        return 'text-success-600 dark:text-success-400';
      case 'down':
        return 'text-error-600 dark:text-error-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Grid lines
  const gridLines = [];
  if (showGrid) {
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i / 4) * chartHeight;
      gridLines.push(
        <line
          key={`grid-${i}`}
          x1={padding}
          y1={y}
          x2={padding + chartWidth}
          y2={y}
          stroke="currentColor"
          strokeWidth="1"
          className="text-gray-200 dark:text-gray-700"
          opacity="0.5"
        />
      );
    }
  }

  return (
    <Card className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        
        {showTrend && (
          <Badge 
            variant="outline" 
            className={cn('flex items-center gap-1', getTrendColor())}
          >
            {getTrendIcon()}
            <span>
              {trend.percentage > 0 && `${trend.percentage}%`}
              {trend.direction === 'neutral' && 'No change'}
            </span>
          </Badge>
        )}
      </div>

      {/* Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{ height }}
        >
          {/* Grid lines */}
          {gridLines}
          
          {/* Area gradient */}
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path
            d={createAreaPath(data)}
            fill={`url(#gradient-${title})`}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Line */}
          <path
            d={createPath(data)}
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="white"
                  stroke={color}
                  strokeWidth="2"
                  className="transition-all duration-300 hover:r-6 cursor-pointer"
                />
                
                {/* Tooltip on hover */}
                <title>
                  {point.label || point.date}: {valueFormatter(point.value)}
                </title>
              </g>
            );
          })}
          
          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map(i => {
            const value = minValue + (i / 4) * valueRange;
            const y = padding + chartHeight - (i / 4) * chartHeight;
            
            return (
              <text
                key={`y-label-${i}`}
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-500 dark:fill-gray-400"
              >
                {valueFormatter(value)}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Data summary */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
        <span>
          {data.length} data points
        </span>
        <span>
          Range: {valueFormatter(minValue)} - {valueFormatter(maxValue)}
        </span>
        <span>
          Latest: {valueFormatter(data[data.length - 1]?.value || 0)}
        </span>
      </div>
    </Card>
  );
};