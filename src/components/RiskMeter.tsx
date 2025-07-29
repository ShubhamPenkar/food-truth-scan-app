import { cn } from '@/lib/utils';
import { AlertTriangle, Shield, AlertCircle } from 'lucide-react';

interface RiskMeterProps {
  score: number; // 0-100, where 100 is safest
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  className?: string;
}

export const RiskMeter = ({ score, size = 'medium', showDetails = true, className }: RiskMeterProps) => {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'low', color: 'health-excellent', label: 'Low Risk', icon: Shield };
    if (score >= 60) return { level: 'medium', color: 'health-good', label: 'Medium Risk', icon: AlertCircle };
    if (score >= 40) return { level: 'high', color: 'health-moderate', label: 'High Risk', icon: AlertTriangle };
    return { level: 'critical', color: 'health-danger', label: 'Critical Risk', icon: AlertTriangle };
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return { container: 'w-16 h-16', text: 'text-xs', icon: 'w-4 h-4' };
      case 'large':
        return { container: 'w-32 h-32', text: 'text-lg', icon: 'w-8 h-8' };
      default:
        return { container: 'w-24 h-24', text: 'text-sm', icon: 'w-6 h-6' };
    }
  };

  const risk = getRiskLevel(score);
  const sizeClasses = getSizeClasses();
  const Icon = risk.icon;

  // Calculate the angle for the meter (180 degrees total, from left to right)
  const angle = (score / 100) * 180 - 90; // -90 to start from left

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Circular Risk Meter */}
      <div className={cn('relative', sizeClasses.container)}>
        {/* Background Circle */}
        <div className="absolute inset-0 rounded-full border-4 border-muted bg-background">
          {/* Risk Level Arc */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                from -90deg,
                hsl(var(--health-danger)) 0deg 36deg,
                hsl(var(--health-moderate)) 36deg 72deg,
                hsl(var(--health-good)) 72deg 108deg,
                hsl(var(--health-excellent)) 108deg 180deg,
                transparent 180deg
              )`
            }}
          />
          
          {/* Inner Circle */}
          <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
            <Icon className={cn(sizeClasses.icon, `text-${risk.color}`)} />
          </div>
          
          {/* Needle */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <div className="w-1 h-1/2 bg-foreground origin-bottom transform -translate-y-full"></div>
          </div>
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="text-center">
          <div className={cn('font-bold', `text-${risk.color}`, sizeClasses.text)}>
            {risk.label}
          </div>
          <div className="text-xs text-muted-foreground">
            Safety Score: {score}/100
          </div>
        </div>
      )}
    </div>
  );
};

interface RiskIndicatorsProps {
  risks: {
    additives: number;
    allergens: number;
    transFats: boolean;
    highSodium: boolean;
    artificialColors: boolean;
    preservatives: number;
  };
  className?: string;
}

export const RiskIndicators = ({ risks, className }: RiskIndicatorsProps) => {
  const indicators = [
    {
      label: 'Additives',
      value: risks.additives,
      threshold: 3,
      icon: '🧪',
      color: risks.additives > 3 ? 'health-danger' : risks.additives > 1 ? 'health-moderate' : 'health-good'
    },
    {
      label: 'Allergens',
      value: risks.allergens,
      threshold: 0,
      icon: '⚠️',
      color: risks.allergens > 0 ? 'health-danger' : 'health-good'
    },
    {
      label: 'Trans Fats',
      value: risks.transFats ? 1 : 0,
      threshold: 0,
      icon: '🚫',
      color: risks.transFats ? 'health-danger' : 'health-good'
    },
    {
      label: 'High Sodium',
      value: risks.highSodium ? 1 : 0,
      threshold: 0,
      icon: '🧂',
      color: risks.highSodium ? 'health-moderate' : 'health-good'
    },
    {
      label: 'Artificial Colors',
      value: risks.artificialColors ? 1 : 0,
      threshold: 0,
      icon: '🎨',
      color: risks.artificialColors ? 'health-moderate' : 'health-good'
    },
    {
      label: 'Preservatives',
      value: risks.preservatives,
      threshold: 2,
      icon: '🥫',
      color: risks.preservatives > 2 ? 'health-moderate' : 'health-good'
    }
  ];

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-3', className)}>
      {indicators.map((indicator, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-2 p-3 rounded-lg border',
            `border-${indicator.color}/20 bg-${indicator.color}/5`
          )}
        >
          <div className="text-lg">{indicator.icon}</div>
          <div className="flex-1">
            <div className="text-xs font-medium text-foreground">
              {indicator.label}
            </div>
            <div className={cn('text-xs', `text-${indicator.color}`)}>
              {indicator.value > indicator.threshold ? 'Warning' : 'OK'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};