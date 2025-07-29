import { cn } from '@/lib/utils';

interface HealthScoreBadgeProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const HealthScoreBadge = ({ score, size = 'medium', className }: HealthScoreBadgeProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'health-excellent';
    if (score >= 60) return 'health-good';
    if (score >= 40) return 'health-moderate';
    if (score >= 20) return 'health-poor';
    return 'health-danger';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Moderate';
    if (score >= 20) return 'Poor';
    return 'Unhealthy';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🟢';
    if (score >= 60) return '🟡';
    if (score >= 40) return '🟠';
    return '🔴';
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'w-16 h-16 text-xs';
      case 'large':
        return 'w-32 h-32 text-xl';
      default:
        return 'w-24 h-24 text-base';
    }
  };

  const colorKey = getScoreColor(score);
  
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div 
        className={cn(
          'rounded-full border-4 flex flex-col items-center justify-center font-bold relative overflow-hidden',
          getSizeClasses(size),
          `border-${colorKey} text-${colorKey}`
        )}
        style={{
          background: `conic-gradient(hsl(var(--${colorKey})) ${score * 3.6}deg, hsl(var(--muted)) ${score * 3.6}deg)`
        }}
      >
        <div className="bg-background rounded-full w-[calc(100%-12px)] h-[calc(100%-12px)] flex flex-col items-center justify-center">
          <div className="text-2xl mb-1">{getScoreEmoji(score)}</div>
          <div className="font-bold">{score}</div>
          {size === 'large' && (
            <div className="text-xs text-muted-foreground mt-1">/100</div>
          )}
        </div>
      </div>
      <div className="text-center">
        <div className={cn('font-semibold', `text-${colorKey}`)}>
          {getScoreLabel(score)}
        </div>
        {size !== 'small' && (
          <div className="text-xs text-muted-foreground">
            Health Score
          </div>
        )}
      </div>
    </div>
  );
};